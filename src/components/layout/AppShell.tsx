import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/layout/Nav";
import { StarField } from "@/components/layout/StarField";
import { LandingView } from "@/views/LandingView";
import { AboutView } from "@/views/AboutView";
import { TonightView } from "@/views/TonightView";
import { LibraryView } from "@/views/LibraryView";
import { KeptView } from "@/views/KeptView";
import { HistoryView } from "@/views/HistoryView";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import type { View } from "@/components/layout/Nav";

type Page = "landing" | "app" | "about";

const EASE = { ease: [0.22, 1, 0.36, 1] as const, duration: 0.25 };

export function AppShell() {
  const [page, setPage] = useState<Page>("landing");
  const [view, setView] = useState<View>("tonight");
  const [bedtime, setBedtime] = useState<boolean>(() =>
    load<boolean>(STORAGE_KEYS.theme, true)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", bedtime);
    save(STORAGE_KEYS.theme, bedtime);
  }, [bedtime]);

  const handleBegin = () => {
    setView("tonight");
    setPage("app");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StarField />

      {/* Persistent header — visible on every page */}
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full shrink-0">
        {page === "app" ? (
          <button
            onClick={() => setPage("landing")}
            className="font-display text-lg text-ink hover:text-honey transition-colors duration-300 ease-calm"
            aria-label="กลับหน้าหลัก"
          >
            ก่อนฝัน
          </button>
        ) : (
          <span aria-hidden className="w-[1px]" />
        )}
        <Button
          variant="quiet"
          size="sm"
          onClick={() => setBedtime((b) => !b)}
          aria-pressed={bedtime}
        >
          {bedtime ? "🌙 โหมดก่อนนอน" : "🕯️ เปิดโหมดก่อนนอน"}
        </Button>
      </header>

      {/* Page content */}
      <AnimatePresence mode="wait">
        {page === "landing" ? (
          <motion.div
            key="landing"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE}
          >
            <LandingView onBegin={handleBegin} onAbout={() => setPage("about")} />
          </motion.div>
        ) : page === "about" ? (
          <motion.div
            key="about"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE}
          >
            <AboutView onBack={() => setPage("landing")} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE}
          >
            <AnimatePresence mode="wait">
              <motion.div key={view} className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE}>
                {view === "tonight" && <TonightView />}
                {view === "library" && <LibraryView />}
                {view === "kept" && <KeptView />}
                {view === "history" && <HistoryView />}
              </motion.div>
            </AnimatePresence>

            <Nav current={view} onChange={setView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
