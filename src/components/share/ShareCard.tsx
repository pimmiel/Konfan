import type { Passage, Book } from "@/types";

export type ShareTheme = "dusk" | "bedtime";

export interface ShareCardProps {
  passage: Passage;
  book: Book;
  includeNote?: boolean;
  theme?: ShareTheme;
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

const TOKENS = {
  bedtime: {
    bg: "#2A2231",
    ink: "#ECE0D8",
    muted: "#B09EAC",
    note: "#C99BA0",
    divider: "#B09EAC",
    starColor: "#ECE0D8",
    starOpacity: 0.22,
    glowColor: "rgba(224, 164, 88, 0.22)",
    wordmarkColor: "#E0A458",
    wordmarkOpacity: 0.55,
  },
  dusk: {
    bg: "#EFE7D6",
    ink: "#3B2E3A",
    muted: "#6E5C6B",
    note: "#C99BA0",
    divider: "#D6CABA",
    starColor: "#3B2E3A",
    starOpacity: 0.10,
    glowColor: "rgba(224, 164, 88, 0.14)",
    // Use plum ink for wordmark in dusk — honey on parchment has contrast ~2:1 (too low)
    wordmarkColor: "#6E5C6B",
    wordmarkOpacity: 0.70,
  },
};

// All styles inline so html-to-image captures them correctly without Tailwind parsing
export function ShareCard({
  passage,
  book,
  includeNote = false,
  theme = "bedtime",
  cardRef,
}: ShareCardProps) {
  const fs = passageFontSize(passage.text);
  const t = TOKENS[theme];

  return (
    <div
      ref={cardRef}
      style={{
        width: 1080,
        height: 1920,
        background: t.bg,
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
          background: `radial-gradient(70% 45% at 50% 0%, ${t.glowColor}, transparent 65%)`,
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
            background: t.starColor,
            opacity: t.starOpacity,
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
            color: t.ink,
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
            background: t.divider,
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
            color: t.muted,
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
              color: t.note,
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
            color: t.wordmarkColor,
            opacity: t.wordmarkOpacity,
            letterSpacing: "0.12em",
          }}
        >
          ก่อนฝัน · Kònfăn
        </span>
      </div>
    </div>
  );
}
