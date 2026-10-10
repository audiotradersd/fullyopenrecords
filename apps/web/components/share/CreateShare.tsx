"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Facebook,
  Mail,
  MoreHorizontal,
  Share2,
  Shuffle,
  Upload,
  X,
} from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import {
  buildShareSvg,
  createAttributedShareUrl,
  DEFAULT_DESIGN,
  loadShareArtwork,
  renderSharePng,
  SHARE_DESIGNS,
  SHARE_FORMATS,
  SHARE_DIMENSIONS,
  type ShareDesign,
  type ShareFormat,
  type ShareableContent,
} from "../../lib/createShare";

const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-4 py-2 text-sm text-white transition hover:border-pink/60 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-45";

export function CreateShareButton({
  content,
  label = "Share",
  compact = false,
}: {
  content: ShareableContent;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("artist_create_share_opened", {
            content_type: content.contentType,
          });
          setOpen(true);
        }}
        className={`${compact ? "h-9 px-3 text-xs" : "h-10 px-4 text-sm"} inline-flex items-center justify-center gap-2 border border-white/15 text-white transition hover:border-pink/60 hover:bg-white/[0.06]`}
      >
        <Share2 className="h-4 w-4" />
        {label}
      </button>
      {open ? (
        <CreateShare content={content} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

export function CreateShare({
  content,
  onClose,
}: {
  content: ShareableContent;
  onClose: () => void;
}) {
  const designs = SHARE_DESIGNS.filter((design) =>
    design.types.includes(content.contentType),
  );
  const [design, setDesign] = useState<ShareDesign>(
    DEFAULT_DESIGN[content.contentType],
  );
  const [format, setFormat] = useState<ShareFormat>("square");
  const [image, setImage] = useState(content.image ?? "");
  const [resolvedImage, setResolvedImage] = useState("");
  const [artworkLoading, setArtworkLoading] = useState(Boolean(content.image));
  const [artworkError, setArtworkError] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [headline, setHeadline] = useState(content.title);
  const [supportingText, setSupportingText] = useState(
    content.subtitle || content.details || "",
  );
  const [personalMessage, setPersonalMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [error, setError] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [accent, setAccent] = useState("#ee5b48");
  const shareUrl = useMemo(
    () => createAttributedShareUrl(content.url, content.contentType),
    [content.url, content.contentType],
  );
  const svg = useMemo(
    () =>
      buildShareSvg(content, design, format, {
        headline,
        supportingText,
        image: resolvedImage,
        palette: { accent },
      }),
    [content, design, format, headline, supportingText, resolvedImage, accent],
  );
  const previewRatio =
    SHARE_DIMENSIONS[format].width / SHARE_DIMENSIONS[format].height;
  const hasArtwork = Boolean(resolvedImage);

  useEffect(() => {
    let current = true;
    setResolvedImage("");
    setArtworkError("");
    if (!image) {
      setArtworkLoading(false);
      return () => { current = false; };
    }
    setArtworkLoading(true);
    loadShareArtwork(image)
      .then((dataUrl) => { if (current) setResolvedImage(dataUrl); })
      .catch((loadError) => {
        if (current) setArtworkError(loadError instanceof Error ? loadError.message : "Artwork could not be loaded.");
      })
      .finally(() => { if (current) setArtworkLoading(false); });
    return () => { current = false; };
  }, [image]);

  useEffect(() => {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [svg]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  useEffect(() => {
    let current = true;
    setAccent("#ee5b48");
    if (!resolvedImage)
      return () => {
        current = false;
      };
    const sourceImage = new Image();
    sourceImage.crossOrigin = "anonymous";
    sourceImage.onload = () => {
      if (!current) return;
      try {
        const sample = document.createElement("canvas");
        sample.width = 24;
        sample.height = 24;
        const context = sample.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(sourceImage, 0, 0, 24, 24);
        const pixels = context.getImageData(0, 0, 24, 24).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
          const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
          if (max - min < 28 || max < 48 || max > 242) continue;
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          count += 1;
        }
        if (count) {
          const channels = [r, g, b].map((value) => value / count);
          const luminance =
            channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
          if (luminance < 128) {
            const mix = (128 - luminance) / (255 - luminance);
            channels.forEach((value, index) => {
              channels[index] = value + (255 - value) * mix;
            });
          } else if (luminance > 180) {
            const scale = 180 / luminance;
            channels.forEach((value, index) => {
              channels[index] = value * scale;
            });
          }
          setAccent(
            `#${channels.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`,
          );
        }
      } catch {
        // External artwork may prohibit pixel sampling; templates retain the neutral FOR accent.
      }
    };
    sourceImage.src = resolvedImage;
    return () => {
      current = false;
    };
  }, [resolvedImage]);

  async function saveCustomImage(file: File) {
    if (
      !/^image\/(jpeg|png|webp)$/.test(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image up to 10 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", "share-assets");
      form.append("alt", `Create & Share image for ${content.artistName}`);
      const response = await fetch("/api/artist/me/media", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url)
        throw new Error(data.error ?? "Could not upload this image.");
      setImage(data.url);
      trackEvent("artist_share_image_uploaded", {
        content_type: content.contentType,
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload this image.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function renderPng() {
    if (!hasArtwork && design !== "type-only")
      throw new Error("Choose artwork or select Type Only before exporting.");
    return renderSharePng(
      svg,
      SHARE_DIMENSIONS[format].width,
      SHARE_DIMENSIONS[format].height,
    );
  }

  async function downloadImage() {
    setBusy(true);
    setError("");
    try {
      const png = await renderPng();
      const url = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fully-open-${content.contentType}-${format}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackEvent("artist_share_image_downloaded", {
        content_type: content.contentType,
        format,
        design,
      });
    } catch (renderError) {
      setError(
        renderError instanceof Error
          ? renderError.message
          : "Image export failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const field = document.createElement("textarea");
        field.value = shareUrl;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copiedLink = document.execCommand("copy");
        field.remove();
        if (!copiedLink) throw new Error("Clipboard unavailable");
      }
      setCopied(true);
      trackEvent("artist_share_link_copied", {
        content_type: content.contentType,
      });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(
        "Could not copy the link. Please copy it from the address below.",
      );
    }
  }

  function launch(target: "whatsapp" | "facebook" | "x") {
    const text = `${headline.trim() || content.title} — ${content.artistName}${supportingText ? `\n${supportingText}` : ""}`;
    const destinations = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      x: `https://x.com/intent/post?text=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    };
    window.open(destinations[target], "_blank", "noopener,noreferrer");
    trackEvent("artist_content_shared", {
      content_type: content.contentType,
      platform: target,
      design,
      format,
    });
  }

  function openEmail() {
    setShowEmail(true);
    trackEvent("artist_content_email_previewed", {
      content_type: content.contentType,
    });
  }

  function sendEmail() {
    const subject = `${headline.trim() || content.title} — ${content.artistName}`;
    const body = [
      personalMessage.trim(),
      "",
      `${headline.trim() || content.title}`,
      `By ${content.artistName}`,
      supportingText.trim(),
      image ? `Artwork: ${image}` : "",
      `${content.cta}: ${shareUrl}`,
      "Shared with Fully Open Records",
    ]
      .filter(Boolean)
      .join("\n\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    trackEvent("artist_content_shared", {
      content_type: content.contentType,
      platform: "email",
      design,
      format,
    });
  }

  async function nativeShare() {
    if (!navigator.share) return;
    setBusy(true);
    setError("");
    try {
      const png = await renderPng();
      const file = new File(
        [png],
        `fully-open-${content.contentType}-${format}.png`,
        { type: "image/png" },
      );
      const shareData = {
        title: headline || content.title,
        text: `${content.artistName} — ${content.cta}`,
        url: shareUrl,
        files: [file],
      };
      if (navigator.canShare?.({ files: [file] }))
        await navigator.share(shareData);
      else
        await navigator.share({
          title: shareData.title,
          text: `${shareData.text}\n${shareUrl}`,
        });
      trackEvent("artist_content_shared", {
        content_type: content.contentType,
        platform: "native",
        design,
        format,
      });
    } catch (shareError) {
      if (
        !(
          shareError instanceof DOMException && shareError.name === "AbortError"
        )
      )
        setError(
          shareError instanceof Error
            ? shareError.message
            : "Sharing could not be opened.",
        );
    } finally {
      setBusy(false);
    }
  }

  function shuffleDesign() {
    const alternatives = designs
      .map((item) => item.id)
      .filter((id) => id !== design);
    if (!alternatives.length) return;
    setDesign(alternatives[Math.floor(Math.random() * alternatives.length)]);
  }

  const noArtworkWarning = !hasArtwork && design !== "type-only";

  function emailHtml() {
    const escape = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (char) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char] ?? char,
      );
    let safeArtwork = "";
    try {
      const parsed = new URL(image, "https://fullyopenrecords.com");
      if (parsed.protocol === "https:" || parsed.protocol === "http:")
        safeArtwork = parsed.toString();
    } catch {
      safeArtwork = "";
    }
    return `<!doctype html><html><body style="margin:0;background:#f1eee6;font-family:Arial,Helvetica,sans-serif;color:#171716"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff"><tr><td style="background:#101116;padding:16px 24px;color:#fff;font-size:12px;letter-spacing:3px;font-weight:bold">FULLY OPEN RECORDS</td></tr>${safeArtwork ? `<tr><td><img src="${escape(safeArtwork)}" alt="${escape(headline || content.title)} artwork" width="640" style="display:block;width:100%;height:auto" /></td></tr>` : ""}<tr><td style="padding:28px 30px"><p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#716d65">${escape(content.contentType)} · ${escape(content.date ?? "")}</p><h1 style="font-size:32px;line-height:1.12;margin:12px 0">${escape(headline || content.title)}</h1><p style="font-size:15px;letter-spacing:2px;text-transform:uppercase;color:#716d65">${escape(content.artistName)}</p>${supportingText ? `<p style="font-size:16px;line-height:1.6">${escape(supportingText)}</p>` : ""}${personalMessage ? `<p style="font-size:16px;line-height:1.6;border-top:1px solid #ddd;padding-top:16px">${escape(personalMessage)}</p>` : ""}<p style="margin-top:28px"><a href="${escape(shareUrl)}" style="display:inline-block;background:#171716;color:white;padding:14px 20px;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px">${escape(content.cta)}</a></p><p style="font-size:12px;color:#716d65">Discover independent music at Fully Open Records.</p></td></tr></table></body></html>`;
  }

  async function copyEmailDesign() {
    const html = emailHtml();
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(html);
      }
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      setError("Could not copy the HTML email design in this browser.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-share-title"
        className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden border border-white/15 bg-[#090b10] text-white shadow-2xl sm:max-h-[92dvh]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[.3em] text-pink">
              Fully Open Records
            </p>
            <h2
              id="create-share-title"
              className="mt-1 text-lg font-semibold sm:text-xl"
            >
              Create & Share{" "}
              <span className="font-normal text-fog">/ {content.title}</span>
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close Create and Share"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-white/10 text-fog hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="flex min-h-[35vh] items-center justify-center bg-[#14151a] p-4 sm:p-8 lg:min-h-0">
            <div
              className="relative w-full max-w-[620px] overflow-hidden bg-[#111] shadow-2xl"
              style={{ aspectRatio: previewRatio, maxHeight: "68vh" }}
            >
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt={`${design.replaceAll("-", " ")} promotional preview`}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[.2em] text-white/60">
                  Preparing poster preview…
                </div>
              )}
            </div>
          </div>
          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[.2em] text-fog">
                  Artwork
                </h3>
                <span className="text-[11px] text-fog">
                  Used as the design focal point
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {content.image ? (
                  <button
                    type="button"
                    onClick={() => setImage(content.image ?? "")}
                    className={`${buttonClass} ${image === content.image ? "border-pink/70 bg-pink/10" : ""}`}
                  >
                    Use existing artwork
                  </button>
                ) : null}
                <label className={`${buttonClass} cursor-pointer`}>
                  <Upload className="h-4 w-4" />
                  Upload image
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void saveCustomImage(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {image && content.image && image !== content.image ? (
                  <button
                    type="button"
                    onClick={() => setImage(content.image ?? "")}
                    className={`${buttonClass} px-3`}
                  >
                    Reset
                  </button>
                ) : null}
              </div>
              {!hasArtwork ? (
                <p className="mt-2 text-xs leading-5 text-amber-200">
                  {artworkLoading
                    ? "Loading the selected artwork…"
                    : artworkError
                      ? `Artwork did not load: ${artworkError}`
                      : "Choose an image to create an artwork design, or switch to Type Only."}
                </p>
              ) : null}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[.2em] text-fog">
                  Design
                </h3>
                <button
                  type="button"
                  onClick={shuffleDesign}
                  className="inline-flex min-h-9 items-center gap-2 px-2 text-xs text-pink hover:text-white"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  Shuffle design
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center border border-white/10"
                  aria-label="Previous design"
                  onClick={() =>
                    setDesign(
                      designs[
                        (designs.findIndex((item) => item.id === design) +
                          designs.length -
                          1) %
                          designs.length
                      ].id,
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <select
                  value={design}
                  onChange={(event) =>
                    setDesign(event.target.value as ShareDesign)
                  }
                  className="h-10 min-w-0 flex-1 border border-white/15 bg-[#101116] px-3 text-sm text-white"
                >
                  {designs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center border border-white/10"
                  aria-label="Next design"
                  onClick={() =>
                    setDesign(
                      designs[
                        (designs.findIndex((item) => item.id === design) + 1) %
                          designs.length
                      ].id,
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-fog">
                Format
              </h3>
              <div className="grid grid-cols-4 gap-1">
                {SHARE_FORMATS.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFormat(item.id as ShareFormat)}
                    className={`min-h-10 border px-2 text-xs ${format === item.id ? "border-pink bg-pink/10 text-white" : "border-white/10 text-fog hover:text-white"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <details className="group border-t border-white/10 pt-4">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[.2em] text-fog">
                Edit text
              </summary>
              <label className="mt-3 block text-xs text-fog">
                Headline
                <input
                  value={headline}
                  maxLength={160}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="mt-1 h-10 w-full border border-white/15 bg-black/20 px-3 text-sm text-white"
                />
              </label>
              <label className="mt-3 block text-xs text-fog">
                Supporting text
                <textarea
                  value={supportingText}
                  maxLength={220}
                  rows={2}
                  onChange={(event) => setSupportingText(event.target.value)}
                  className="mt-1 w-full border border-white/15 bg-black/20 p-3 text-sm text-white"
                />
              </label>
            </details>
            {error ? (
              <p
                role="alert"
                className="border border-red-400/30 bg-red-400/5 p-3 text-xs leading-5 text-red-100"
              >
                {error}
              </p>
            ) : null}
            {noArtworkWarning ? (
              <p className="text-xs text-amber-200">
                Select artwork or Type Only to download a finished design.
              </p>
            ) : null}
            <div className="border-t border-white/10 pt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-fog">
                Share this {content.contentType}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void copyLink()}
                  className={buttonClass}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </button>
                <button
                  type="button"
                  disabled={busy || noArtworkWarning}
                  onClick={() => void downloadImage()}
                  className={buttonClass}
                >
                  <Download className="h-4 w-4" />
                  Download image
                </button>
                <button
                  type="button"
                  onClick={() => launch("whatsapp")}
                  className={buttonClass}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => launch("facebook")}
                  className={buttonClass}
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => launch("x")}
                  className={buttonClass}
                >
                  <span className="font-semibold">𝕏</span>X
                </button>
                <button
                  type="button"
                  onClick={openEmail}
                  className={buttonClass}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                {typeof navigator !== "undefined" &&
                typeof navigator.share === "function" ? (
                  <button
                    type="button"
                    disabled={busy || noArtworkWarning}
                    onClick={() => void nativeShare()}
                    className={`${buttonClass} col-span-2`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    Share image & link
                  </button>
                ) : null}
              </div>
              <p className="mt-3 break-all text-[10px] leading-4 text-fog">
                Destination: {shareUrl}
              </p>
            </div>
          </div>
        </div>
      </section>
      {showEmail ? (
        <div
          className="fixed inset-0 z-[130] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4"
          role="presentation"
          onMouseDown={() => setShowEmail(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-email-title"
            className="max-h-[94dvh] w-full max-w-xl overflow-auto border border-white/15 bg-[#090b10] p-5 text-white sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.25em] text-pink">
                  Email share
                </p>
                <h3
                  id="share-email-title"
                  className="mt-1 text-xl font-semibold"
                >
                  A note from {content.artistName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEmail(false)}
                aria-label="Back to design"
                className="grid h-10 w-10 place-items-center border border-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mt-5 block text-xs text-fog">
              Personal message <span className="font-normal">(optional)</span>
              <textarea
                value={personalMessage}
                maxLength={500}
                rows={3}
                placeholder="Add a personal note for your listener…"
                onChange={(event) => setPersonalMessage(event.target.value)}
                className="mt-2 w-full border border-white/15 bg-black/20 p-3 text-sm text-white"
              />
            </label>
            <article className="mt-5 overflow-hidden border border-white/10 bg-white text-[#171716]">
              <div className="bg-[#101116] px-5 py-3 text-xs font-semibold uppercase tracking-[.2em] text-white">
                Fully Open Records
              </div>
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="max-h-64 w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                <p className="text-xs uppercase tracking-[.2em] text-[#6b6760]">
                  {content.contentType} · {content.date ?? ""}
                </p>
                <h4 className="mt-2 text-2xl font-bold">
                  {headline || content.title}
                </h4>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[.15em] text-[#6b6760]">
                  {content.artistName}
                </p>
                {supportingText ? (
                  <p className="mt-4 text-sm leading-6">{supportingText}</p>
                ) : null}
                {personalMessage ? (
                  <p className="mt-4 border-t border-black/10 pt-4 text-sm leading-6">
                    {personalMessage}
                  </p>
                ) : null}
                <a
                  href={shareUrl}
                  className="mt-5 inline-block bg-[#171716] px-5 py-3 text-xs font-bold tracking-[.15em] text-white"
                >
                  {content.cta}
                </a>
              </div>
            </article>
            <p className="mt-3 text-xs leading-5 text-fog">
              Your email app will open with a formatted note and the direct
              Fully Open link. For an HTML message, copy the designed email and
              paste it into a rich-text email composer. The image is included as
              an artwork link; automatic HTML-email delivery isn’t enabled.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void copyEmailDesign()}
                className={buttonClass}
              >
                <Copy className="h-4 w-4" />
                {emailCopied ? "HTML copied" : "Copy HTML design"}
              </button>
              <button
                type="button"
                onClick={sendEmail}
                className="flex min-h-11 items-center justify-center gap-2 bg-pink px-4 text-sm font-semibold text-white"
              >
                <Mail className="h-4 w-4" />
                Open email app
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
