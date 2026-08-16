"use client";

import type { GameMode } from "@/lib/types";

interface ModeTabsProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

const TABS: { id: GameMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "daily",
    label: "Daily",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.2 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "infinite",
    label: "Infinite",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
        <path d="M7 8.5a3.5 3.5 0 100 7c3.5 0 4.5-7 8-7a3.5 3.5 0 110 7c-3.5 0-4.5-7-8-7z" />
      </svg>
    ),
  },
];

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Game mode"
      className="flex items-center gap-1 rounded-full border border-white/10 bg-[var(--surface)] p-1"
    >
      {TABS.map((tab) => {
        const active = tab.id === mode;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={[
              "group relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] transition-colors sm:gap-2 sm:px-6 sm:text-xs sm:tracking-[0.14em]",
              active
                ? "bg-[var(--accent)] text-white"
                : "text-muted hover:text-text",
            ].join(" ")}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="size-3.5 sm:size-4">{tab.icon}</span>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
