import { motion } from "framer-motion";
import { Flame, BookOpen, Moon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { usePassageStore } from "@/store/usePassageStore";
import { DEMO_PASSAGES } from "@/lib/demoPassages";

interface LandingViewProps {
  onBegin: () => void;
  onAbout: () => void;
}

function Candle() {
  return (
    <div aria-hidden className="flex justify-center">
      <svg width="52" height="128" viewBox="0 0 52 128" fill="none">
        {/* Halo glow */}
        <ellipse
          cx="26" cy="40"
          rx="22" ry="16"
          fill="#E0A458"
          className="candle-halo"
        />
        {/* Flame group — pivots from wick top */}
        <g className="candle-flame">
          {/* Outer flame */}
          <path
            d="M26 18 C20 30 18 38 26 46 C34 38 32 30 26 18Z"
            fill="#E0A458"
          />
          {/* Inner cream highlight */}
          <path
            d="M26 28 C23 34 23 40 26 44 C29 40 29 34 26 28Z"
            fill="#FFF3DE"
            opacity="0.75"
          />
        </g>
        {/* Wick */}
        <line x1="26" y1="46" x2="26" y2="54"
          stroke="#6E5C6B" strokeWidth="1.5" strokeLinecap="round" />
        {/* Candle body */}
        <rect x="13" y="54" width="26" height="66" rx="5" fill="#C99BA0" />
        {/* Body gloss */}
        <rect x="17" y="59" width="7" height="46" rx="3"
          fill="white" opacity="0.12" />
      </svg>
    </div>
  );
}

const FEATURES: { Icon: LucideIcon; label: string }[] = [
  { Icon: Flame,    label: "เช็คอินอารมณ์" },
  { Icon: BookOpen, label: "ชั้นหนังสือ" },
  { Icon: Moon,     label: "reflection ปิดวัน" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const DEMO = DEMO_PASSAGES[0];

export function LandingView({ onBegin, onAbout }: LandingViewProps) {
  const hasPassages = usePassageStore((s) => s.passages.length > 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease: EASE }}
      >
        <Eyebrow>before dream</Eyebrow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, ease: EASE, duration: 0.6 }}
      >
        <Candle />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ease: EASE }}
        className="space-y-2"
      >
        <h1
          className="font-display font-medium text-ink leading-none"
          style={{ fontSize: "clamp(52px, 12vw, 84px)" }}
        >
          ก่อนฝัน
        </h1>
        <p className="font-display italic text-honey text-2xl">Kònfăn</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, ease: EASE }}
        className="space-y-1.5"
      >
        <p className="font-sans text-base text-ink/80">ช่วงเวลาเงียบๆ ก่อนหลับตา</p>
        <p className="font-display italic text-muted">A quiet moment before you close your eyes</p>
      </motion.div>

      {!hasPassages && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, ease: EASE }}
          className="w-full max-w-xs text-center space-y-1.5"
        >
          <Eyebrow>ตัวอย่าง · a glimpse</Eyebrow>
          <p className="font-display text-xl text-ink leading-relaxed">
            {DEMO.text}
          </p>
          <p className="font-sans text-xs text-muted">
            — จาก {DEMO.bookTitle}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: hasPassages ? 0.85 : 1.0, ease: EASE }}
      >
        <Button variant="primary" size="md" onClick={onBegin}>
          เริ่มค่ำคืนนี้ · Begin tonight
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: hasPassages ? 1.05 : 1.3, ease: EASE }}
        className="flex items-start justify-center gap-10 pt-2"
      >
        {FEATURES.map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-2">
            <f.Icon size={26} strokeWidth={1.5} aria-hidden className="text-muted" />
            <span className="font-sans text-xs text-muted">{f.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: hasPassages ? 1.25 : 1.6, ease: EASE }}
      >
        <button
          onClick={onAbout}
          className="font-sans text-xs text-muted/60 hover:text-muted transition-colors duration-300 ease-calm"
        >
          เกี่ยวกับ · About
        </button>
      </motion.div>
    </div>
  );
}
