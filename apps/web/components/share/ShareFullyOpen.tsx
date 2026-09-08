"use client";

import { Check, Copy, Facebook, Mail, MoreHorizontal, Send, Share2, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "../../lib/site";
import { trackEvent } from "../../lib/analytics";
import { Button } from "../ui/button";

const shareUrl = new URL("/get-heard", siteConfig.url).toString();
const shareMessage = "Check out Fully Open Records — it's an independent music platform and 24/7 radio station built around discovering new music. Artists can create a free page, upload their tracks and be considered for Fully Open Radio.";
const shortShareMessage = "Thought you might like Fully Open Records. It's an independent music platform and radio station for discovering new artists. You can upload your music free and be considered for Fully Open Radio.";
const emailBody = `I thought you might be interested in Fully Open Records.\n\nIt's an independent music platform and 24/7 radio station focused on discovering new music. Artists can create a free artist page, upload their music and be considered for Fully Open Radio.\n\n${shareUrl}`;

type ShareFullyOpenProps = {
  variant: "homepage" | "dashboard";
};

export default function ShareFullyOpen({ variant }: ShareFullyOpenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canUseNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  function openShare() {
    trackEvent("share_for_opened", { placement: variant });
    setIsOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    trackEvent("share_for_copy_link", { placement: variant });
    window.setTimeout(() => setCopied(false), 2200);
  }

  function openWindow(url: string, eventName: string) {
    trackEvent(eventName, { placement: variant });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: "Fully Open Records", text: shortShareMessage, url: shareUrl });
      trackEvent("share_for_native", { placement: variant });
    } catch {
      // Dismissing the system share sheet is not an error the visitor needs to see.
    }
  }

  const isHomepage = variant === "homepage";

  return (
    <>
      <section className={isHomepage ? "py-8 md:py-10" : ""}>
        <div className={isHomepage ? "mx-auto max-w-6xl px-6" : ""}>
          <div className={`flex flex-col gap-5 border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between ${isHomepage ? "rounded-2xl" : "rounded-xl"}`}>
            <div>
              <p className="text-lg font-semibold text-white">{isHomepage ? "Know an artist who should be heard?" : "Invite an Artist"}</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-fog">
                {isHomepage
                  ? "Fully Open grows through artists discovering other artists. If you know someone making great music, send them our way."
                  : "Know someone making music that deserves to be heard?"}
              </p>
            </div>
            <Button type="button" onClick={openShare} className="shrink-0 rounded-full px-5">
              <Share2 className="mr-2 h-4 w-4" />{isHomepage ? "Share Fully Open" : "Share Fully Open"} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="share-fully-open-title" className="w-full max-w-lg rounded-2xl border border-pink/30 bg-[linear-gradient(145deg,rgba(25,8,37,0.98),rgba(8,12,25,0.98))] p-6 shadow-[0_0_50px_rgba(209,74,139,0.2)]" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-pink">Community</p>
                <h2 id="share-fully-open-title" className="mt-2 text-2xl font-semibold text-white">Share Fully Open</h2>
              </div>
              <Button type="button" variant="outline" aria-label="Close share dialog" onClick={() => setIsOpen(false)} className="h-10 w-10 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-fog">Know someone making great music? Invite them to create a free artist page, upload their music and get the opportunity to be heard on Fully Open Radio.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Button type="button" variant="outline" onClick={() => void copyLink()} className="justify-start">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Link copied" : "Copy Link"}</Button>
              <Button type="button" variant="outline" onClick={() => openWindow(`mailto:?subject=${encodeURIComponent("Thought you might like Fully Open Records")}&body=${encodeURIComponent(emailBody)}`, "share_for_email")} className="justify-start"><Mail className="mr-2 h-4 w-4" />Email</Button>
              <Button type="button" variant="outline" onClick={() => openWindow(`https://wa.me/?text=${encodeURIComponent(`${shortShareMessage}\n\n${shareUrl}`)}`, "share_for_whatsapp")} className="justify-start"><Send className="mr-2 h-4 w-4" />WhatsApp</Button>
              <Button type="button" variant="outline" onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "share_for_facebook")} className="justify-start"><Facebook className="mr-2 h-4 w-4" />Facebook</Button>
              <Button type="button" variant="outline" onClick={() => openWindow(`https://x.com/intent/post?text=${encodeURIComponent(`${shortShareMessage}\n\n${shareUrl}`)}`, "share_for_x")} className="justify-start"><span className="mr-2 text-sm font-semibold">𝕏</span>X / Twitter</Button>
              {canUseNativeShare ? <Button type="button" variant="outline" onClick={() => void nativeShare()} className="justify-start"><MoreHorizontal className="mr-2 h-4 w-4" />More…</Button> : null}
            </div>
            <p className="mt-5 text-xs text-fog">Artists create a free page and can be considered for Fully Open Radio.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
