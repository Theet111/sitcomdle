"use client";

import { useEffect, useState } from "react";
import { MAX_GUESSES, buildShareText } from "@/lib/game";
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
      className="sd-fade-up relative overflow-hidden rounded-xl border border-white/10 bg-[var(--surface)] p-5 sm:p-6"
      aria-live="polite"
    >
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
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
              {target.show.name} · {target.occupation} · {target.debutYear}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2.5 text-[11px] font-black tracking-[0.14em] text-text uppercase transition-colors hover:border-white/25 hover:bg-white/[0.08]"
            >
              {copied ? "Copied!" : "Share"}
            </button>

            {mode === "infinite" && (
              <button
                type="button"
                onClick={onNext}
                className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[11px] font-black tracking-[0.14em] text-white uppercase transition-colors hover:bg-[var(--accent-hover)]"
              >
                Next character
              </button>
            )}
          </div>

          {mode === "daily" && (
            <p className="text-[10px] font-bold tracking-[0.18em] text-faint uppercase">
              Next show in <span className="font-mono text-muted">{countdown}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
