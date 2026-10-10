"use client";

import { useEffect } from "react";
import { getShareAttribution, trackEvent } from "../../lib/analytics";

export default function PageViewEvent({ eventName }: { eventName: string }) {
  useEffect(() => {
    trackEvent(eventName, getShareAttribution());
  }, [eventName]);

  return null;
}
