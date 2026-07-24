import { motion } from "framer-motion";

export type View = "tonight" | "library" | "history";

interface NavProps {
  current: View;
  onChange: (view: View) => void;
}

const tabs: { id: View; glyph: string; label: string }[] = [
  { id: "tonight", glyph: "🕯️", label: "คืนนี้" },
  { id: "library", glyph: "📚", label: "ชั้นหนังสือ" },
  { id: "history", glyph: "🌙", label: "บันทึก" },
];

export function Nav({ current, onChange }: NavProps) {
  return (
    <nav
      aria-label="เมนูหลัก"
      className={
        "fixed bottom-0 left-0 right-0 z-40 " +
        "bg-surface border-t border-line " +
        "pb-[env(safe-area-inset-bottom)]"
      }
    >
      <div className="flex justify-center max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-current={active ? "page" : undefined}
              className={
                "flex flex-1 flex-col items-center gap-1 py-3 " +
                "font-sans text-xs transition-colors duration-300 ease-calm " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey " +
                (active ? "text-honey font-medium" : "text-muted hover:text-ink")
              }
            >
              <span className="text-lg" aria-hidden>
                {tab.glyph}
              </span>
              <span>{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="w-1 h-1 rounded-full bg-honey"
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
                />
              )}
              {!active && <div className="w-1 h-1" aria-hidden />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
