import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { usePassageStore } from "@/store/usePassageStore";
import { useBookStore } from "@/store/useBookStore";
import { relativeTime } from "@/lib/relativeTime";

export function ResurfacingCard() {
  const passageStore = usePassageStore();
  const [passage, setPassage] = useState(() => passageStore.forResurfacing());
  const book = useBookStore((s) =>
    s.books.find((b) => b.id === passage?.bookId)
  );

  if (!passage || !book) return null;

  const handleAnother = () => {
    const next = passageStore.forResurfacing();
    setPassage(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-none border-line/60">
        <div className="flex flex-col gap-3">
          <Eyebrow>จากค่ำคืนก่อนๆ · From an earlier night</Eyebrow>

          <p className="font-display text-xl text-ink leading-relaxed">
            {passage.text}
          </p>

          <p className="font-sans text-xs text-muted">
            เธอเก็บไว้เมื่อ {relativeTime(passage.createdAt)} จาก {book.title}
            <span className="italic ml-1">
              · You kept this {relativeTime(passage.createdAt)} ago
            </span>
          </p>

          <div className="flex justify-end">
            <Button variant="quiet" size="sm" onClick={handleAnother}>
              ดูอีกประโยค · another one
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
