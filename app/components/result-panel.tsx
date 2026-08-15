"use client";

import { useEffect, useState } from "react";
import { MAX_GUESSES, buildShareText, getInitials } from "@/lib/game";
import type { Character, GameMode, GameStatus, GuessResult } from "@/lib/types";

interface ResultPanelProps {
  status: Exclude<GameStatus, "playing">;
  target: Character;
  results: GuessResult[];
  mode: GameMode;
  puzzleNumber: number;
  onNext: () => void;
}

function useCountdown() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const next = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
      );
      const remaining = Math.max(0, next - now.getTime());
      const hours = Math.floor(remaining / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1000);
      setLabel(
        [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":"),
      );
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return label;
}

export function ResultPanel({
  status,
  target,
  results,
  mode,
  puzzleNumber,
  onNext,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown();
  const won = status === "won";

  async function share() {
    const text = buildShareText(results, won, puzzleNumber);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className="sd-fade-up relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-5 backdrop-blur-xl sm:p-6"
      aria-live="polite"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-60 blur-3xl"
        style={{
          background: won
            ? "radial-gradient(50% 60% at 50% 50%, var(--correct-line), transparent 70%)"
            : "radial-gradient(50% 60% at 50% 50%, var(--incorrect-line), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl text-sm font-black"
            style={{
              background: `color-mix(in srgb, ${target.show.accent} 24%, transparent)`,
              color: target.show.accent,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${target.show.accent} 50%, transparent)`,
            }}
            aria-hidden
          >
            {getInitials(target.name)}
          </span>

          <div>
            <p
              className={`text-[11px] font-black tracking-[0.2em] uppercase ${
                won ? "text-[var(--correct-text)]" : "text-[var(--incorrect-text)]"
              }`}
            >
              {won
                ? `Nailed it in ${results.length}/${MAX_GUESSES}`
                : "Out of guesses — the answer was"}
            </p>
            <h2 className="mt-1 text-2xl leading-none font-black tracking-tight text-text uppercase sm:text-3xl">
              {target.name}
            </h2>
            <p className="mt-1.5 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              {target.show.name} · {target.occupation} · S{target.debutSeason}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              className="rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-[11px] font-black tracking-[0.16em] text-text uppercase transition-all hover:border-white/25 hover:bg-white/[0.08] active:scale-95"
            >
              {copied ? "Copied!" : "Share"}
            </button>

            {mode === "infinite" && (
              <button
                type="button"
                onClick={onNext}
                className="rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2.5 text-[11px] font-black tracking-[0.16em] text-black uppercase shadow-[0_0_26px_-8px_var(--accent)] transition-transform active:scale-95"
              >
                Next character
              </button>
            )}
          </div>

          {mode === "daily" && (
            <p className="text-[10px] font-bold tracking-[0.18em] text-faint uppercase">
              Next sitcom in <span className="font-mono text-muted">{countdown}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
