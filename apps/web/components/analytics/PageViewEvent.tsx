"use client";

import { useEffect } from "react";
import { trackEvent } from "../../lib/analytics";

export default function PageViewEvent({ eventName }: { eventName: string }) {
  useEffect(() => {
    trackEvent(eventName);
  }, [eventName]);

  return null;
}
