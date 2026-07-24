import { motion } from "framer-motion";
import type { Poem } from "@/types";
import { Card } from "@/components/ui/Card";
import { POEMS } from "@/lib/poems";

const EASE = [0.22, 1, 0.36, 1] as const;

function StaggerLines({
  lines,
  startDelay,
  italic,
  dimmed,
}: {
  lines: string[];
  startDelay: number;
  italic?: boolean;
  dimmed?: boolean;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: startDelay + i * 0.35, ease: EASE }}
          className={italic ? "italic" : undefined}
          style={dimmed ? { opacity: 0.75 } : undefined}
        >
          {line}
        </motion.p>
      ))}
    </>
  );
}

export function PoemCard({ poem }: { poem: Poem }) {
  const paired = poem.pairedWith ? POEMS.find((p) => p.id === poem.pairedWith) : undefined;

  // Thai lines finish at: 0.15 + (N-1)*0.35. Separator + English start after.
  const thaiEndDelay = 0.15 + poem.lines.length * 0.35;
  const enStartDelay = thaiEndDelay + 0.25;

  return (
    <Card glowing className="max-w-md text-center">
      {/* Thai */}
      <div className="prose-poem text-xl md:text-2xl text-ink space-y-1.5">
        <StaggerLines lines={poem.lines} startDelay={0.15} />
      </div>

      {/* English (if paired) */}
      {paired && (
        <>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: thaiEndDelay, ease: EASE }}
            className="my-4 border-line"
          />
          <div className="prose-poem text-base text-muted space-y-1">
            <StaggerLines lines={paired.lines} startDelay={enStartDelay} italic dimmed />
          </div>
        </>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: paired ? enStartDelay + paired.lines.length * 0.35 : thaiEndDelay + 0.2 }}
        className="mt-5 font-sans text-xs italic text-muted"
      >
        {poem.attribution}
      </motion.p>
    </Card>
  );
}
