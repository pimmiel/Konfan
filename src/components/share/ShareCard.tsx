import type { Passage, Book } from "@/types";

export interface ShareCardProps {
  passage: Passage;
  book: Book;
  includeNote?: boolean;
  /** Forwarded to the root div so html-to-image can capture it */
  cardRef?: React.RefObject<HTMLDivElement>;
}

// Auto-scale passage text so long quotes breathe without overflowing
function passageFontSize(text: string): number {
  const len = text.length;
  if (len < 50) return 72;
  if (len < 100) return 56;
  if (len < 160) return 44;
  return 36;
}

const STARS = [
  { top: 155, left: 185, r: 3 },
  { top: 310, left: 855, r: 2 },
  { top: 120, left: 570, r: 2.5 },
];

// All styles inline so html-to-image captures them correctly without Tailwind parsing
export function ShareCard({ passage, book, includeNote = false, cardRef }: ShareCardProps) {
  const fs = passageFontSize(passage.text);

  return (
    <div
      ref={cardRef}
      style={{
        width: 1080,
        height: 1920,
        background: "#2A2231",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "220px 140px 260px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Sky glow — honey warmth bleeding down from top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(224, 164, 88, 0.22), transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Star dots — very subtle */}
      {STARS.map((s, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: "50%",
            background: "#ECE0D8",
            opacity: 0.22,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 52,
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Candle glyph — echoes the app identity */}
        <span
          aria-hidden
          style={{ fontSize: 52, opacity: 0.5, lineHeight: 1 }}
        >
          🕯
        </span>

        {/* Passage text */}
        <p
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: fs,
            fontWeight: 500,
            color: "#ECE0D8",
            lineHeight: 1.55,
            margin: 0,
            letterSpacing: "-0.01em",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {passage.text}
        </p>

        {/* Hairline divider */}
        <div
          aria-hidden
          style={{
            width: 80,
            height: 1,
            background: "#B09EAC",
            opacity: 0.45,
            flexShrink: 0,
          }}
        />

        {/* Attribution — always shown, credits the author */}
        <p
          style={{
            fontFamily: "'Instrument Sans', 'Noto Sans Thai', sans-serif",
            fontSize: 30,
            fontWeight: 400,
            color: "#B09EAC",
            margin: 0,
            letterSpacing: "0.02em",
            lineHeight: 1.65,
          }}
        >
          — จาก {book.title}
          {book.author ? `, ${book.author}` : ""}
        </p>

        {/* Note — shown only when user opts in */}
        {includeNote && passage.note && (
          <p
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 30,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C99BA0",
              margin: 0,
              lineHeight: 1.65,
              opacity: 0.9,
            }}
          >
            {passage.note}
          </p>
        )}
      </div>

      {/* Wordmark — bottom center, quiet growth signal */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 28,
            color: "#E0A458",
            opacity: 0.55,
            letterSpacing: "0.12em",
          }}
        >
          ก่อนฝัน · Kònfăn
        </span>
      </div>
    </div>
  );
}
