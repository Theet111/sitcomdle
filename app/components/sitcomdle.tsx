"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CHARACTERS, getCharacter } from "@/lib/characters";
import { SHOWS } from "@/lib/shows";
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
const REVEAL_MS = (SCORED_COLUMNS.length + 1) * 85 + 340;

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
  /** Present for daily rounds so yesterday's state can never leak past UTC midnight. */
  dateKey?: string;
}

interface StatsOverride {
  dateKey: string;
  value: Stats;
}

const EMPTY_STATS: Stats = { played: 0, wins: 0, streak: 0, best: 0, last: null };

/* -------------------------------------------------------------------------- */
/*  Client-only date                                                          */
/*                                                                            */
/*  The page is statically prerendered, so the date must never be read while   */
/*  rendering on the server — `useSyncExternalStore` hands back `null` there   */
/*  and the real key on the client, with no hydration mismatch.               */
/* -------------------------------------------------------------------------- */

const readClientDateKey = () => getDateKey();
const readServerDateKey = () => null;

/** Notify React at UTC midnight and after a sleeping tab becomes active again. */
function subscribeToUtcDate(callback: () => void): () => void {
  let timer: number | undefined;

  function scheduleMidnight() {
    const now = new Date();
    const nextMidnight = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    );
    timer = window.setTimeout(() => {
      callback();
      scheduleMidnight();
    }, Math.max(250, nextMidnight - now.getTime() + 50));
  }

  function syncAfterWake() {
    if (!document.hidden) callback();
  }

  scheduleMidnight();
  window.addEventListener("focus", syncAfterWake);
  document.addEventListener("visibilitychange", syncAfterWake);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("focus", syncAfterWake);
    document.removeEventListener("visibilitychange", syncAfterWake);
  };
}

function useDateKey(): string | null {
  return useSyncExternalStore(subscribeToUtcDate, readClientDateKey, readServerDateKey);
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
  return { target: getDailyCharacter(dateKey), guesses: readSavedGuesses(dateKey), dateKey };
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
  const [statsOverride, setStatsOverride] = useState<StatsOverride | null>(null);
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
    () => {
      if (mode === "daily" && dateKey && round?.dateKey !== dateKey) {
        return loadDailyRound(dateKey);
      }
      return round;
    },
    [round, dateKey, mode],
  );

  const stats = useMemo<Stats>(
    () =>
      statsOverride?.dateKey === dateKey
        ? statsOverride.value
        : dateKey
          ? readStats()
          : EMPTY_STATS,
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
      const next: Round = { ...activeRound, target, guesses };
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
          setStatsOverride({
            dateKey,
            value: recordDailyResult(dateKey, outcome === "won"),
          });
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
  const inputDisabled = !activeRound || revealing || settledStatus !== "playing";
  const visibleAnimatedIndex =
    mode === "daily" && round?.dateKey !== dateKey ? null : animatedIndex;

  return (
    <div className="sd-stage min-h-full">
      <header className="sd-topbar">
        <div className="mx-auto grid h-full w-full max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
          <div className="relative justify-self-start">
            <button
              type="button"
              onClick={() => setStatsOpen((open) => !open)}
              aria-expanded={statsOpen}
              aria-label="Open daily statistics"
              className="sd-icon-button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} className="size-5">
                <path d="M7 4h10v3.5A5 5 0 0 1 12 12a5 5 0 0 1-5-4.5V4Z" />
                <path d="M7 6H4v1a4 4 0 0 0 4 4M17 6h3v1a4 4 0 0 1-4 4M12 12v5M8 20h8M9 17h6" strokeLinecap="round" />
              </svg>
            </button>

            {statsOpen && (
              <div className="sd-fade-up absolute top-[calc(100%+12px)] left-0 z-40 w-60 rounded-xl border border-white/10 bg-[var(--surface)] p-4 shadow-[0_24px_55px_rgba(0,0,0,0.45)]">
                <p className="mb-3 text-[10px] font-black tracking-[0.18em] text-faint uppercase">
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
                      <dt className="text-[9px] font-bold tracking-[0.12em] text-faint uppercase">
                        {item.label}
                      </dt>
                      <dd className="font-mono text-xl font-black text-text">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <h1 className="text-xl font-black tracking-[0.055em] uppercase sm:text-[28px]">
            <span className="text-text">Sitcom</span>
            <span className="text-[var(--accent-2)]">dle</span>
          </h1>

          <a href="#about" aria-label="How to play" className="sd-icon-button justify-self-end">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} className="size-5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 10.5V17M12 7.3v.2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 pt-8 pb-16 sm:px-8 sm:pt-9">
          <header className="flex flex-col items-center gap-3">
            <ModeTabs mode={mode} onChange={changeMode} />
            <p className="text-center text-[10px] font-bold tracking-[0.2em] text-faint uppercase">
              {mode === "daily" &&
                (dateKey
                  ? `Daily #${puzzleNumber} · ${CHARACTERS.length} characters`
                  : "Loading today's character")}
              {mode === "infinite" && `Endless mode · Streak ${infiniteStreak}`}
            </p>
          </header>

          <div className={`mx-auto w-full max-w-[1180px] ${notice ? "sd-shake" : ""}`}>
            <CharacterSearch
              guessedIds={guessedIds}
              disabled={inputDisabled}
              onSelect={handleGuess}
            />
          </div>

          <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-1.5" aria-label={`${remaining} guesses left`}>
              {Array.from({ length: MAX_GUESSES }, (_, index) => (
                <span
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index < guessCount ? "w-6 bg-[var(--accent-2)]" : "w-3 bg-white/12"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-[10px] font-black tracking-[0.16em] uppercase ${
                notice ? "text-[var(--accent)]" : "text-faint"
              }`}
            >
              {notice ?? `${remaining} guesses left`}
            </p>
          </div>

          <div className="sd-board-shell">
            <GuessGrid results={results} animatedIndex={visibleAnimatedIndex} />
          </div>

          {status !== "playing" && activeRound && (
            <div className="sd-board-shell">
              <ResultPanel
                status={status}
                target={activeRound.target}
                results={results}
                mode={mode}
                puzzleNumber={puzzleNumber}
                onNext={startInfiniteRound}
              />
            </div>
          )}

          <Legend />
        </section>

        <AboutSection />
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-3 px-5 text-center">
          <p className="text-sm font-black tracking-[0.14em] uppercase">
            <span>Sitcom</span><span className="text-[var(--accent-2)]">dle</span>
          </p>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-faint uppercase">
            One character. Six guesses. No laugh track required.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Legend() {
  const items = [
    { className: "sd-cell--correct", label: "Exact match" },
    { className: "sd-cell--partial", label: "Close or related" },
    { className: "sd-cell--incorrect", label: "No match" },
    { className: "sd-cell--up", label: "Target is higher" },
    { className: "sd-cell--down", label: "Target is lower" },
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
      </div>
      <p className="text-center text-[10px] tracking-[0.1em] text-faint uppercase">
        Age is measured at the character&apos;s first appearance
      </p>
    </footer>
  );
}

function AboutSection() {
  const modernShows = SHOWS.filter((show) => show.premiere >= 2000).sort(
    (a, b) => a.premiere - b.premiere || a.name.localeCompare(b.name),
  );

  const clues = [
    { className: "sd-cell--correct", title: "Green", detail: "Exact match" },
    { className: "sd-cell--partial", title: "Yellow", detail: "Close or shared trait" },
    { className: "sd-cell--incorrect", title: "Red", detail: "No match" },
    { className: "sd-cell--up", title: "Orange ↑", detail: "Target is higher" },
    { className: "sd-cell--down", title: "Purple ↓", detail: "Target is lower" },
  ];

  return (
    <section id="about" className="scroll-mt-8 border-t border-white/10">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-3xl">
          <p className="sd-kicker">How to play</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-text sm:text-4xl">
            What is Sitcomdle?
          </h2>
          <p className="mt-5 text-base leading-7 text-muted">
            Sitcomdle is a daily character guessing game built for people who know their
            Dunder Mifflin from their Greendale. You get six guesses. Every row tells you
            how your pick compares by show, role, job, location, age, and debut year.
          </p>
        </div>

        <div className="mt-14">
          <h3 className="text-2xl font-black tracking-[-0.03em]">Reading the colour clues</h3>
          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
            {clues.map((clue) => (
              <div key={clue.title} className="flex items-center gap-3">
                <span className={`size-12 shrink-0 rounded-lg border ${clue.className}`} aria-hidden />
                <span>
                  <strong className="block text-sm text-text">{clue.title}</strong>
                  <span className="text-sm text-muted">{clue.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-white/10 pt-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="sd-kicker">The cast list</p>
            <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">
              {CHARACTERS.length} characters from {SHOWS.length} shows
            </h3>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Every title in the pool premiered in 2000 or later, spanning modern sitcoms
              and a few cult TV crossovers from the turn of the millennium through today.
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {modernShows.map((show) => (
              <li key={show.id} className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-2">
                <span className="font-semibold text-[#d8d8d8]">{show.name}</span>
                <span className="font-mono text-[11px] text-faint">{show.premiere}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-black tracking-[-0.03em]">Quick answers</h3>
          <div className="mt-5 border-t border-white/10">
            {[
              {
                question: "When does the daily puzzle reset?",
                answer: "At midnight UTC. Everyone gets the same character for that date.",
              },
              {
                question: "What counts as a partial match?",
                answer: "On the Show column, yellow means the titles share a story or ensemble type such as Workplace, Friend group, Family, Medical, or Supernatural. Roles turn yellow when they are one tier apart, occupations when they share a career field, and locations when they share a region. Gender has no partial state. Age and debut year use orange/purple arrows instead.",
              },
              {
                question: "How old is a character in the grid?",
                answer: "Age is measured at the character's first appearance, not the actor's current age.",
              },
            ].map((item) => (
              <details key={item.question} className="group border-b border-white/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-text">
                  {item.question}
                  <span className="text-xl font-light text-[var(--accent-2)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
