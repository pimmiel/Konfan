import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareCard } from "./ShareCard";
import { captureAndShare } from "@/lib/shareImage";
import type { Passage, Book } from "@/types";

interface SharePreviewModalProps {
  passage: Passage;
  book: Book;
  onClose: () => void;
}

// Card renders at 1080 × 1920; scale it down for the in-app preview
const CARD_W = 1080;
const PREVIEW_W = 268;

// Heuristic: mobile browsers expose navigator.share; desktop generally doesn't
const CAN_NATIVE_SHARE = typeof navigator.share === "function";

export function SharePreviewModal({ passage, book, onClose }: SharePreviewModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(false);

  const scale = PREVIEW_W / CARD_W;
  const previewH = Math.round(1920 * scale);

  const handleShare = async () => {
    if (!cardRef.current || capturing) return;
    setError(false);
    setCapturing(true);
    try {
      await captureAndShare(cardRef.current);
    } catch (err) {
      // User cancelled the native share sheet — not a real error
      const isCancelled =
        err instanceof Error && err.name === "AbortError";
      if (!isCancelled) setError(true);
    } finally {
      setCapturing(false);
    }
  };

  const shareLabel = CAN_NATIVE_SHARE
    ? "แชร์ · Share"
    : "บันทึกเป็นรูป · Save as image";

  return (
    <AnimatePresence>
      {/* Off-screen full-size card — mounted so html-to-image can rasterize it */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -10000,
          top: -10000,
          width: CARD_W,
          height: 1920,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <ShareCard passage={passage} book={book} cardRef={cardRef} />
      </div>

      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-plum-deep/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-5"
        >
          {/* Scaled preview */}
          <div
            style={{
              width: PREVIEW_W,
              height: previewH,
              overflow: "hidden",
              borderRadius: 10,
              flexShrink: 0,
              boxShadow:
                "0 0 60px -12px rgba(224, 164, 88, 0.30), 0 24px 48px -16px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: CARD_W,
              }}
            >
              <ShareCard passage={passage} book={book} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[200px]">
            <button
              onClick={handleShare}
              disabled={capturing}
              className={
                "w-full font-sans text-sm font-medium rounded-pill px-6 py-2.5 " +
                "bg-honey text-plum-deep transition-all duration-300 ease-calm " +
                "disabled:opacity-50 disabled:pointer-events-none " +
                "hover:bg-honey-deep"
              }
            >
              {capturing ? "กำลังสร้างรูป…" : shareLabel}
            </button>

            {error && (
              <p className="font-sans text-xs text-rose text-center">
                เกิดข้อผิดพลาด ลองอีกครั้ง · Something went wrong
              </p>
            )}

            <button
              onClick={onClose}
              className="font-sans text-xs text-plum-soft hover:text-paper transition-colors duration-300 ease-calm"
            >
              ยกเลิก · Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
