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

export function getShareAttribution(): EventParameters {
  if (typeof window === "undefined") return {};
  const storageKey = "for-share-attribution";
  const params = new URLSearchParams(window.location.search);
  const incoming = {
    share_source: params.get("utm_source") ?? "",
    share_medium: params.get("utm_medium") ?? "",
    share_campaign: params.get("utm_campaign") ?? "",
    share_content: params.get("utm_content") ?? "",
  };
  if (incoming.share_medium === "artist_share") {
    try { window.sessionStorage.setItem(storageKey, JSON.stringify(incoming)); } catch { /* storage may be disabled */ }
    return incoming;
  }
  try {
    const saved = window.sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as EventParameters : {};
  } catch {
    return {};
  }
}
