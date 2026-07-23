import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/layout/Nav";
import { TonightView } from "@/views/TonightView";
import { LibraryView } from "@/views/LibraryView";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import type { View } from "@/components/layout/Nav";

export function AppShell() {
  const [view, setView] = useState<View>("tonight");
  const [bedtime, setBedtime] = useState<boolean>(() =>
    load<boolean>(STORAGE_KEYS.theme, false)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", bedtime);
    save(STORAGE_KEYS.theme, bedtime);
  }, [bedtime]);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
        <span className="font-display text-lg text-ink">ก่อนฝัน</span>
        <Button
          variant="quiet"
          size="sm"
          onClick={() => setBedtime((b) => !b)}
          aria-pressed={bedtime}
        >
          {bedtime ? "🌙 โหมดก่อนนอน" : "🕯️ เปิดโหมดก่อนนอน"}
        </Button>
      </header>

      <AnimatePresence mode="wait">
        {view === "tonight" ? (
          <motion.div
            key="tonight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <TonightView />
          </motion.div>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <LibraryView />
          </motion.div>
        )}
      </AnimatePresence>

      <Nav current={view} onChange={setView} />
    </div>
  );
}
