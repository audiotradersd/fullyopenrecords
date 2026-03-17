"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

type SessionUser = {
  id: number;
  email: string;
  username: string;
  accountType: "listener" | "artist";
  role: string;
  artistId?: number | null;
  artistSlug?: string | null;
};

type AuthMode = "login" | "register";

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  modalMode: AuthMode | null;
  openAuth: (mode?: AuthMode, accountType?: "listener" | "artist") => void;
  closeAuth: () => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as {
      error?: unknown;
      issues?: Array<{ message?: unknown }>;
      name?: unknown;
    };

    if (typeof record.error === "string") {
      return record.error;
    }

    if (Array.isArray(record.issues) && record.issues.length > 0) {
      const firstMessage = record.issues.find((issue) => typeof issue?.message === "string")?.message;
      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }

    if (typeof record.name === "string") {
      return record.name;
    }
  }

  return "Authentication failed";
}

function AuthModal({
  mode,
  initialRegisterType,
  onClose,
  onSuccess
}: {
  mode: AuthMode;
  initialRegisterType: "listener" | "artist";
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [registerType, setRegisterType] = useState<"listener" | "artist">(initialRegisterType);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const payload =
      mode === "login"
        ? {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? "")
          }
        : {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            username: String(formData.get("username") ?? ""),
            accountType: registerType
          };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(getErrorMessage(result));
      return;
    }

    await onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[rgba(14,6,24,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-fog">Fully Open Accounts</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {mode === "login" ? "Log in" : "Create your account"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-fog transition hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          action={async (formData) => {
            await handleSubmit(formData);
          }}
        >
          {mode === "register" ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm text-fog">Username</span>
                <input
                  name="username"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none ring-0 placeholder:text-fog/70"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterType("listener")}
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    registerType === "listener"
                      ? "border-pink/60 bg-pink/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-fog"
                  }`}
                >
                  Listener
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterType("artist")}
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    registerType === "artist"
                      ? "border-pink/60 bg-pink/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-fog"
                  }`}
                >
                  Artist
                </button>
              </div>
            </>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm text-fog">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-fog">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
            />
          </label>

          {error ? <p className="text-sm text-pink">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<AuthMode | null>(null);
  const [registerType, setRegisterType] = useState<"listener" | "artist">("listener");

  async function refreshSession() {
    setLoading(true);
    const response = await fetch("/api/auth/session", { cache: "no-store" });
    const payload = await response.json();
    setUser(payload.user ?? null);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      modalMode,
      openAuth: (mode = "login", accountType = "listener") => {
        setRegisterType(accountType);
        setModalMode(mode);
      },
      closeAuth: () => setModalMode(null),
      refreshSession,
      logout
    }),
    [user, loading, modalMode]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalMode ? (
        <AuthModal
          mode={modalMode}
          initialRegisterType={registerType}
          onClose={() => setModalMode(null)}
          onSuccess={refreshSession}
        />
      ) : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
