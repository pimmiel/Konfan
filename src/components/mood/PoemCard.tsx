import { motion } from "framer-motion";
import type { Poem } from "@/types";
import { Card } from "@/components/ui/Card";

export function PoemCard({ poem }: { poem: Poem }) {
  return (
    <Card glowing className="max-w-md text-center">
      <div className="prose-poem text-xl md:text-2xl text-ink space-y-1.5">
        {poem.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.p>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 + poem.lines.length * 0.35 + 0.2 }}
        className="mt-5 font-sans text-xs italic text-muted"
      >
        {poem.attribution}
      </motion.p>
    </Card>
  );
}
