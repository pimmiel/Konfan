import { motion } from "framer-motion";
import { Display, Eyebrow, Body } from "@/components/ui/Typography";
import { useMoodStore } from "@/store/useMoodStore";
import { POEMS, moodByKey } from "@/lib/poems";
import { relativeNight } from "@/lib/relativeTime";

export function HistoryView() {
  const entries = useMoodStore((s) => s.entries);
  const streak = useMoodStore((s) => s.streak)();

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-24">
      <div className="mb-8 space-y-2">
        <Display>บันทึกค่ำคืน</Display>
        <Eyebrow>Nights you've closed</Eyebrow>
        {streak > 0 && (
          <p className="font-sans text-sm text-honey pt-1">
            {streak} คืนติดกัน · {streak}-night streak
          </p>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <span className="text-4xl" aria-hidden>🌙</span>
          <Body className="text-muted">
            ยังไม่มีบันทึกเลยนะ · No nights recorded yet
          </Body>
        </div>
      ) : (
        <>
          <ol className="relative border-l border-line space-y-0">
            {entries.map((entry, i) => {
              const moodData = entry.mood ? moodByKey(entry.mood) : null;
              const poem = entry.poemId ? POEMS.find((p) => p.id === entry.poemId) : undefined;

              return (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="relative pl-8 pb-8"
                >
                  {/* dot on the timeline — muted for visit-only entries */}
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-paper"
                    style={{ backgroundColor: moodData ? moodData.tint : "rgb(var(--muted))" }}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {moodData ? (
                        <>
                          <span className="font-sans text-base text-ink">
                            {moodData.glyph} {moodData.labelTh}
                          </span>
                          <span className="font-sans text-sm italic text-muted">
                            · {moodData.labelEn}
                          </span>
                        </>
                      ) : (
                        <span className="font-display italic text-muted text-sm">
                          แวะมาคืนนี้ · A quiet visit
                        </span>
                      )}
                      <span className="ml-auto font-sans text-xs text-muted">
                        {relativeNight(entry.createdAt)}
                      </span>
                    </div>

                    {poem && (
                      <p className="font-display italic text-muted text-sm leading-relaxed">
                        {poem.lines[0]}
                      </p>
                    )}

                    {entry.reflection && (
                      <p className="font-sans text-sm text-sage leading-relaxed">
                        "{entry.reflection}"
                      </p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <p className="mt-4 font-display italic text-center text-muted text-sm leading-relaxed">
            ทุกคืนที่ผ่านมา เธอกลับมาหาตัวเองเสมอ
            <br />
            Every night, you came back to yourself.
          </p>
        </>
      )}
    </div>
  );
}
