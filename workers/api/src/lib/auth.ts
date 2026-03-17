import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const SESSION_TOKEN_BYTES = 32;
// Cloudflare Workers PBKDF2 currently rejects iteration counts above 100000.
const PASSWORD_ITERATIONS = 100000;
const PASSWORD_HASH_BYTES = 32;

export const SESSION_COOKIE_NAME = "for_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function signAdminJwt(secret: string, email: string) {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(encoder.encode(secret));
}

export async function verifyAdminJwt(secret: string, token: string) {
  const result = await jwtVerify(token, encoder.encode(secret));
  return result.payload;
}

function toBase64Url(bytes: Uint8Array) {
  const value = btoa(String.fromCharCode(...bytes));
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromHex(value: string) {
  return new Uint8Array(value.match(/.{1,2}/g)?.map((part) => Number.parseInt(part, 16)) ?? []);
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeHexEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export function generateRandomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(SESSION_TOKEN_BYTES));
  return toBase64Url(bytes);
}

export function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toHex(bytes);
}

async function deriveKeyMaterial(password: string) {
  return crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
}

export async function hashPassword(password: string, salt = generateSalt()) {
  const keyMaterial = await deriveKeyMaterial(password);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(salt),
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256"
    },
    keyMaterial,
    PASSWORD_HASH_BYTES * 8
  );

  return {
    salt,
    hash: toHex(new Uint8Array(derivedBits))
  };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const { hash } = await hashPassword(password, salt);
  return constantTimeHexEqual(hash, expectedHash);
}

export async function hashSessionToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return toHex(new Uint8Array(digest));
}
