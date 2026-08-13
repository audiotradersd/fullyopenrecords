"use client";

type EventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, parameters?: EventParameters) => void;
  }
}

export function trackEvent(eventName: string, parameters?: EventParameters) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}
