import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Section({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section
      className={cn("mx-auto w-full max-w-[1200px] px-6 py-16 md:px-6 md:py-[120px]", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function Panel({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  className,
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-[10px] bg-pink px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(209,74,139,0.42)] disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
