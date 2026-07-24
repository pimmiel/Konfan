import { motion } from "framer-motion";
import { MOODS } from "@/lib/poems";
import type { MoodKey } from "@/types";
import { Eyebrow } from "@/components/ui/Typography";

interface Props {
  selected?: MoodKey;
  onSelect: (mood: MoodKey) => void;
}

/**
 * The signature moment: five petals arranged in a soft arc. Choosing one
 * warms the whole room (App reads `selected` and shifts an ambient tint).
 * This is the interaction the app is remembered by — keep it tactile.
 */
export function MoodPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Eyebrow>คืนนี้ใจเธอเป็นยังไง</Eyebrow>
      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood, i) => {
          const active = selected === mood.key;
          return (
            <motion.button
              key={mood.key}
              onClick={() => onSelect(mood.key)}
              aria-pressed={active}
              aria-label={`${mood.labelTh} (${mood.labelEn})`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.94 }}
              className={
                "group flex flex-col items-center gap-1.5 rounded-card px-5 py-4 " +
                "border transition-colors duration-300 ease-calm " +
                (active
                  ? "border-honey bg-honey/15"
                  : "border-line hover:border-sage")
              }
              style={active ? { boxShadow: `0 0 30px -6px ${mood.tint}` } : undefined}
            >
              <span className="text-2xl" aria-hidden>
                {mood.glyph}
              </span>
              <span className="font-sans text-sm text-ink">{mood.labelTh}</span>
              <span className="font-sans text-xs italic text-muted">{mood.labelEn}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
