"use client";

const tokenKey = "for_admin_token";

export function getToken() {
  return typeof window === "undefined" ? "" : window.localStorage.getItem(tokenKey) ?? "";
}

export function setToken(token: string) {
  window.localStorage.setItem(tokenKey, token);
}

