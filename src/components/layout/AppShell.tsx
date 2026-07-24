import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/layout/Nav";
import { StarField } from "@/components/layout/StarField";
import { LandingView } from "@/views/LandingView";
import { AboutView } from "@/views/AboutView";
import { TonightView } from "@/views/TonightView";
import { LibraryView } from "@/views/LibraryView";
import { HistoryView } from "@/views/HistoryView";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import type { View } from "@/components/layout/Nav";

type Page = "landing" | "app" | "about";

const EASE = { ease: [0.22, 1, 0.36, 1] as const, duration: 0.25 };

export function AppShell() {
  const [page, setPage] = useState<Page>("landing");
  const [view, setView] = useState<View>("tonight");
  const [bedtime, setBedtime] = useState<boolean>(() =>
    load<boolean>(STORAGE_KEYS.theme, false)
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
    <div className="min-h-screen">
      <StarField />

      <AnimatePresence mode="wait">
        {page === "landing" ? (
          <motion.div
            key="landing"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={EASE}
          >
            <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
              <button
                onClick={() => setPage("landing")}
                className="font-display text-lg text-ink hover:text-honey transition-colors duration-300 ease-calm"
                aria-label="กลับหน้าหลัก"
              >
                ก่อนฝัน
              </button>
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
              {view === "tonight" && (
                <motion.div key="tonight" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE}>
                  <TonightView />
                </motion.div>
              )}
              {view === "library" && (
                <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE}>
                  <LibraryView />
                </motion.div>
              )}
              {view === "history" && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE}>
                  <HistoryView />
                </motion.div>
              )}
            </AnimatePresence>

            <Nav current={view} onChange={setView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
