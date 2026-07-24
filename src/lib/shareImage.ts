import { toBlob } from "html-to-image";

/** Passages longer than this are kept privately but can't be shared — fair use boundary. */
export const SHARE_CHAR_LIMIT = 320;

/**
 * Captures a mounted DOM node as a PNG, then shares it via Web Share API
 * (mobile) or falls back to a direct download (desktop / unsupported).
 *
 * Call only after document.fonts.ready has resolved — the caller is
 * responsible for awaiting that before showing the share button.
 */
export async function captureAndShare(node: HTMLElement): Promise<void> {
  // Give the browser one more tick to settle before rasterizing
  await document.fonts.ready;

  const blob = await toBlob(node, {
    pixelRatio: 2,      // retina-quality export
    cacheBust: true,    // avoids stale cross-origin cache blocking font fetch
  });

  if (!blob) throw new Error("shareImage: toBlob returned null");

  const file = new File([blob], "konfan.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    // Mobile (iOS Safari / Android Chrome): opens native share sheet →
    // user picks IG story, LINE, etc.
    await navigator.share({ files: [file] });
  } else {
    // Desktop fallback: trigger a download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "konfan.png";
    a.click();
    URL.revokeObjectURL(url);
  }
}
