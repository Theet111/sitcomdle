"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CHARACTERS, getCharacter } from "@/lib/characters";
import {
  MAX_GUESSES,
  SCORED_COLUMNS,
  compareCharacters,
  getDailyCharacter,
  getDateKey,
  getPuzzleNumber,
  getRandomCharacter,
} from "@/lib/game";
import type { Character, GameMode, GameStatus } from "@/lib/types";
import { CharacterSearch } from "./character-search";
import { GuessGrid } from "./guess-grid";
import { ModeTabs } from "./mode-tabs";
import { ResultPanel } from "./result-panel";

/** Cascade length: the name cell plus every scored cell, then the flip itself. */
const REVEAL_MS = (SCORED_COLUMNS.length + 1) * 110 + 560;

const dailyStorageKey = (dateKey: string) => `sitcomdle:daily:${dateKey}`;
const STATS_KEY = "sitcomdle:stats";

interface Stats {
  played: number;
  wins: number;
  streak: number;
  best: number;
  last: string | null;
}

interface Round {
  target: Character;
  guesses: Character[];
}

const EMPTY_STATS: Stats = { played: 0, wins: 0, streak: 0, best: 0, last: null };

/* -------------------------------------------------------------------------- */
/*  Client-only date                                                          */
/*                                                                            */
/*  The page is statically prerendered, so the date must never be read while   */
/*  rendering on the server — `useSyncExternalStore` hands back `null` there   */
/*  and the real key on the client, with no hydration mismatch.               */
/* -------------------------------------------------------------------------- */

const subscribeToNothing = () => () => {};
const readClientDateKey = () => getDateKey();
const readServerDateKey = () => null;

function useDateKey(): string | null {
  return useSyncExternalStore(subscribeToNothing, readClientDateKey, readServerDateKey);
}

function readStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...EMPTY_STATS, ...(JSON.parse(raw) as Partial<Stats>) } : EMPTY_STATS;
  } catch {
    return EMPTY_STATS;
  }
}

function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return getDateKey(new Date(Date.UTC(year, month - 1, day - 1)));
}

function readSavedGuesses(dateKey: string): Character[] {
  try {
    const raw = localStorage.getItem(dailyStorageKey(dateKey));
    if (!raw) return [];
    const ids = JSON.parse(raw) as unknown;
    if (!Array.isArray(ids)) return [];
    return ids
      .filter((id): id is string => typeof id === "string")
      .map(getCharacter)
      .filter((character): character is Character => Boolean(character))
      .slice(0, MAX_GUESSES);
  } catch {
    return [];
  }
}

function loadDailyRound(dateKey: string): Round {
  return { target: getDailyCharacter(dateKey), guesses: readSavedGuesses(dateKey) };
}

function deriveStatus(round: Round | null): GameStatus {
  if (!round) return "playing";
  if (round.guesses.some((guess) => guess.id === round.target.id)) return "won";
  return round.guesses.length >= MAX_GUESSES ? "lost" : "playing";
}

/** Writes the finished daily result through to storage and returns the new stats. */
function recordDailyResult(dateKey: string, won: boolean): Stats {
  const current = readStats();
  if (current.last === dateKey) return current;

  const streak = won ? (current.last === previousDateKey(dateKey) ? current.streak + 1 : 1) : 0;
  const next: Stats = {
    played: current.played + 1,
    wins: current.wins + (won ? 1 : 0),
    streak,
    best: Math.max(current.best, streak),
    last: dateKey,
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}

export function Sitcomdle() {
  const dateKey = useDateKey();

  const [mode, setMode] = useState<GameMode>("daily");
  /** Set once the player interacts; until then the daily round is derived below. */
  const [round, setRound] = useState<Round | null>(null);
  const [statsOverride, setStatsOverride] = useState<Stats | null>(null);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [infiniteStreak, setInfiniteStreak] = useState(0);

  const revealTimer = useRef<number | undefined>(undefined);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(revealTimer.current);
      window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  const activeRound = useMemo<Round | null>(
    () => round ?? (dateKey ? loadDailyRound(dateKey) : null),
    [round, dateKey],
  );

  const stats = useMemo<Stats>(
    () => statsOverride ?? (dateKey ? readStats() : EMPTY_STATS),
    [statsOverride, dateKey],
  );

  /** Truth of the round; the UI holds it back until the flip cascade finishes. */
  const settledStatus = deriveStatus(activeRound);
  const status: GameStatus = revealing ? "playing" : settledStatus;

  const flash = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2200);
  }, []);

  const handleGuess = useCallback(
    (character: Character) => {
      if (!activeRound || revealing || settledStatus !== "playing") return;
      if (activeRound.guesses.some((guess) => guess.id === character.id)) {
        flash(`${character.name} is already on the board`);
        return;
      }

      const { target } = activeRound;
      const guesses = [...activeRound.guesses, character];
      const next: Round = { target, guesses };
      const outcome = deriveStatus(next);

      setRound(next);
      setAnimatedIndex(guesses.length - 1);
      setRevealing(true);

      if (mode === "daily" && dateKey) {
        localStorage.setItem(
          dailyStorageKey(dateKey),
          JSON.stringify(guesses.map((guess) => guess.id)),
        );
        if (outcome !== "playing") {
          setStatsOverride(recordDailyResult(dateKey, outcome === "won"));
        }
      }

      if (mode === "infinite" && outcome !== "playing") {
        setInfiniteStreak((streak) => (outcome === "won" ? streak + 1 : 0));
      }

      window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(() => setRevealing(false), REVEAL_MS);
    },
    [activeRound, dateKey, flash, mode, revealing, settledStatus],
  );

  const startInfiniteRound = useCallback(() => {
    window.clearTimeout(revealTimer.current);
    setRevealing(false);
    setAnimatedIndex(null);
    setRound((current) => ({ target: getRandomCharacter(current?.target.id), guesses: [] }));
  }, []);

  const changeMode = useCallback(
    (nextMode: GameMode) => {
      if (nextMode === mode) return;
      window.clearTimeout(revealTimer.current);
      setRevealing(false);
      setAnimatedIndex(null);
      setStatsOpen(false);
      setMode(nextMode);

      if (nextMode === "daily" && dateKey) {
        setRound(loadDailyRound(dateKey));
      } else if (nextMode === "infinite") {
        setRound({ target: getRandomCharacter(), guesses: [] });
      }
    },
    [dateKey, mode],
  );

  const results = useMemo(
    () =>
      activeRound
        ? activeRound.guesses.map((guess) => compareCharacters(guess, activeRound.target))
        : [],
    [activeRound],
  );

  const guessedIds = useMemo(
    () => activeRound?.guesses.map((guess) => guess.id) ?? [],
    [activeRound],
  );

  const guessCount = activeRound?.guesses.length ?? 0;
  const remaining = MAX_GUESSES - guessCount;
  const puzzleNumber = dateKey ? getPuzzleNumber(dateKey) : 0;
  const isDuel = mode === "duel";
  const inputDisabled = isDuel || !activeRound || revealing || settledStatus !== "playing";

  return (
    <div className="sd-stage relative flex min-h-full flex-col">
      <div className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
        <header className="flex flex-col items-center gap-5">
          <div className="flex w-full items-center justify-between gap-4">
            <h1 className="flex items-baseline gap-1.5 text-lg font-black tracking-[-0.02em] uppercase sm:text-xl">
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                Sitcom
              </span>
              <span className="text-text">dle</span>
            </h1>

            <div className="relative">
              <button
                type="button"
                onClick={() => setStatsOpen((open) => !open)}
                aria-expanded={statsOpen}
                aria-label="Statistics"
                className="grid size-9 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-muted transition-all hover:border-white/20 hover:text-text"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="size-4">
                  <path d="M5 20V11M12 20V4M19 20v-6" strokeLinecap="round" />
                </svg>
              </button>

              {statsOpen && (
                <div className="sd-fade-up absolute top-[calc(100%+8px)] right-0 z-40 w-60 rounded-2xl border border-white/10 bg-[var(--surface)]/95 p-4 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                  <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-faint uppercase">
                    Daily stats
                  </p>
                  <dl className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Played", value: stats.played },
                      {
                        label: "Win %",
                        value: stats.played ? Math.round((stats.wins / stats.played) * 100) : 0,
                      },
                      { label: "Streak", value: stats.streak },
                      { label: "Best", value: stats.best },
                    ].map((item) => (
                      <div key={item.label}>
                        <dt className="text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
                          {item.label}
                        </dt>
                        <dd className="font-mono text-xl font-black text-text">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          <ModeTabs mode={mode} onChange={changeMode} />

          <p className="text-center text-[10px] font-bold tracking-[0.22em] text-faint uppercase">
            {mode === "daily" &&
              (dateKey
                ? `Daily #${puzzleNumber} · ${CHARACTERS.length} characters`
                : "Loading today's character")}
            {mode === "infinite" && `Endless mode · Streak ${infiniteStreak}`}
            {isDuel && "Head-to-head · Coming soon"}
          </p>
        </header>

        <div className={notice ? "sd-shake" : undefined}>
          <CharacterSearch
            guessedIds={guessedIds}
            disabled={inputDisabled}
            onSelect={handleGuess}
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-1.5" aria-label={`${remaining} guesses left`}>
            {Array.from({ length: MAX_GUESSES }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index < guessCount
                    ? "w-6 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                    : "w-3 bg-white/12"
                }`}
              />
            ))}
          </div>
          <p
            className={`text-[10px] font-black tracking-[0.18em] uppercase ${
              notice ? "text-[var(--accent)]" : "text-faint"
            }`}
          >
            {notice ?? `${remaining} left`}
          </p>
        </div>

        {isDuel ? (
          <DuelPlaceholder />
        ) : (
          <GuessGrid results={results} animatedIndex={animatedIndex} />
        )}

        {!isDuel && status !== "playing" && activeRound && (
          <ResultPanel
            status={status}
            target={activeRound.target}
            results={results}
            mode={mode}
            puzzleNumber={puzzleNumber}
            onNext={startInfiniteRound}
          />
        )}

        {!isDuel && <Legend />}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { className: "sd-cell--correct", label: "Exact match" },
    { className: "sd-cell--partial", label: "Close / related" },
    { className: "sd-cell--incorrect", label: "No match" },
  ];

  return (
    <footer className="flex flex-col items-center gap-3 pt-2">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span className={`size-3.5 rounded-[5px] border ${item.className}`} aria-hidden />
            <span className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
              {item.label}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-muted" aria-hidden>
            <path d="M12 3.5 20 14h-5v6.5H9V14H4z" />
          </svg>
          <span className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
            Target is higher
          </span>
        </span>
      </div>
      <p className="text-center text-[10px] tracking-[0.1em] text-faint uppercase">
        Age is measured at the character&apos;s first appearance
      </p>
    </footer>
  );
}

function DuelPlaceholder() {
  return (
    <section className="sd-fade-up relative overflow-hidden rounded-3xl border border-dashed border-white/12 bg-white/[0.02] p-8 text-center sm:p-12">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <span className="sd-pulse grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6 text-[var(--accent)]">
            <path d="M4 4l10 10M20 4L10 14" strokeLinecap="round" />
            <path d="M6 20l3-3M18 20l-3-3" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="text-xl font-black tracking-tight text-text uppercase">Duel mode</h2>
        <p className="text-xs leading-relaxed font-semibold tracking-[0.1em] text-muted uppercase">
          Race a friend through the same six guesses. Wiring up soon.
        </p>
        <div className="flex w-full items-center gap-3 pt-2 opacity-40">
          <div className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/[0.03]" />
          <span className="text-[10px] font-black tracking-[0.2em] text-faint uppercase">vs</span>
          <div className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/[0.03]" />
        </div>
      </div>
    </section>
  );
}
