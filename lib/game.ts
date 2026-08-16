import { CHARACTERS } from "./characters";
import type {
  CellResult,
  Character,
  CharacterRole,
  ColumnKey,
  GuessResult,
} from "./types";

export const MAX_GUESSES = 6;

export interface ColumnDef {
  key: ColumnKey;
  label: string;
  /** Short label used on narrow viewports. */
  shortLabel: string;
  hint: string;
}

export const COLUMNS: ColumnDef[] = [
  { key: "character", label: "Character", shortLabel: "Character", hint: "Your guess" },
  { key: "show", label: "Show", shortLabel: "Show", hint: "Yellow = at least one shared story or ensemble type" },
  { key: "gender", label: "Gender", shortLabel: "Gender", hint: "Exact match only" },
  { key: "role", label: "Role", shortLabel: "Role", hint: "Yellow = one tier away (Lead / Main / Supporting / Recurring)" },
  { key: "occupation", label: "Occupation", shortLabel: "Job", hint: "Yellow = same career field" },
  { key: "location", label: "Location", shortLabel: "Where", hint: "Yellow = same state" },
  { key: "age", label: "Age", shortLabel: "Age", hint: "Age at first appearance. Arrow points toward the target" },
  { key: "debut", label: "Debut year", shortLabel: "Year", hint: "Year of first appearance. Arrow points toward the target" },
];

/** Comparable columns only — the character label column is never scored. */
export const SCORED_COLUMNS = COLUMNS.filter((column) => column.key !== "character");

const ROLE_ORDER: CharacterRole[] = ["Lead", "Main", "Supporting", "Recurring"];

function compareShow(guess: Character, target: Character): CellResult {
  const base = { key: "show" as const, value: guess.show.short, full: guess.show.name };

  if (guess.show.id === target.show.id) {
    return { ...base, status: "correct" };
  }
  const sharedType = guess.show.types.some((type) => target.show.types.includes(type));
  if (sharedType) {
    return { ...base, status: "partial" };
  }
  return { ...base, status: "incorrect" };
}

function compareRole(guess: Character, target: Character): CellResult {
  const base = { key: "role" as const, value: guess.role };

  if (guess.role === target.role) {
    return { ...base, status: "correct" };
  }
  const distance = Math.abs(ROLE_ORDER.indexOf(guess.role) - ROLE_ORDER.indexOf(target.role));
  return { ...base, status: distance === 1 ? "partial" : "incorrect" };
}

function compareOccupation(guess: Character, target: Character): CellResult {
  const base = {
    key: "occupation" as const,
    value: guess.occupation,
    detail: guess.field,
    full: `${guess.occupation} — ${guess.field}`,
  };

  if (guess.occupation === target.occupation) {
    return { ...base, status: "correct" };
  }
  if (guess.field === target.field) {
    return { ...base, status: "partial" };
  }
  return { ...base, status: "incorrect" };
}

function compareLocation(guess: Character, target: Character): CellResult {
  const base = {
    key: "location" as const,
    value: guess.city,
    detail: guess.region,
    full: `${guess.city}, ${guess.region}`,
  };

  if (guess.city === target.city && guess.region === target.region) {
    return { ...base, status: "correct" };
  }
  if (guess.region === target.region) {
    return { ...base, status: "partial" };
  }
  return { ...base, status: "incorrect" };
}

function compareNumber(
  key: "age" | "debut",
  guessValue: number,
  targetValue: number,
  format: (value: number) => string,
): CellResult {
  if (guessValue === targetValue) {
    return { key, status: "correct", value: format(guessValue) };
  }
  return {
    key,
    status: "incorrect",
    value: format(guessValue),
    direction: targetValue > guessValue ? "up" : "down",
  };
}

/** Scores a guess against the hidden target, one cell per attribute column. */
export function compareCharacters(guess: Character, target: Character): GuessResult {
  const cells: CellResult[] = [
    compareShow(guess, target),
    {
      key: "gender",
      status: guess.gender === target.gender ? "correct" : "incorrect",
      value: guess.gender,
    },
    compareRole(guess, target),
    compareOccupation(guess, target),
    compareLocation(guess, target),
    compareNumber("age", guess.age, target.age, String),
    compareNumber(
      "debut",
      guess.debutYear,
      target.debutYear,
      String,
    ),
  ];

  return { character: guess, cells, isWin: guess.id === target.id };
}

/* -------------------------------------------------------------------------- */
/*  Daily puzzle                                                              */
/* -------------------------------------------------------------------------- */

/** Day 1 of Sitcomdle, used to number the daily puzzles. */
const EPOCH = Date.UTC(2024, 0, 1);

/** `YYYY-MM-DD` in UTC, so every player worldwide shares the same puzzle. */
export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getPuzzleNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const days = Math.floor((Date.UTC(year, month - 1, day) - EPOCH) / 86_400_000);
  return days + 1;
}

/** Deterministic 32-bit hash (FNV-1a + final avalanche) so the same date always maps to the same character. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  return hash >>> 0;
}

export function getDailyCharacter(dateKey: string): Character {
  return CHARACTERS[hashString(`sitcomdle-${dateKey}`) % CHARACTERS.length];
}

export function getRandomCharacter(excludeId?: string): Character {
  const pool = excludeId
    ? CHARACTERS.filter((character) => character.id !== excludeId)
    : CHARACTERS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* -------------------------------------------------------------------------- */
/*  Search                                                                    */
/* -------------------------------------------------------------------------- */

const COMBINING_MARKS = /[̀-ͯ]/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9 ]/g, "");
}

/**
 * Autocomplete over character names and show names. Full titles, compact titles,
 * IDs, and common aliases all participate in show search.
 */
export function searchCharacters(query: string, limit = 16): Character[] {
  const needle = normalize(query).trim();
  if (!needle) return [];

  const scored: { character: Character; score: number }[] = [];

  for (const character of CHARACTERS) {
    const name = normalize(character.name);
    const showTerms = [
      character.show.name,
      character.show.short,
      character.show.id.replaceAll("-", " "),
      ...(character.show.aliases ?? []),
    ].map(normalize);
    let score = -1;

    if (name.startsWith(needle)) {
      score = 0;
    } else if (name.split(" ").some((word) => word.startsWith(needle))) {
      score = 1;
    } else if (name.includes(needle)) {
      score = 2;
    } else if (
      showTerms.some(
        (show) => show.startsWith(needle) || show.split(" ").some((word) => word.startsWith(needle)),
      )
    ) {
      score = 3;
    } else if (showTerms.some((show) => show.includes(needle))) {
      score = 4;
    }

    if (score >= 0) scored.push({ character, score });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.character.name.localeCompare(b.character.name))
    .slice(0, limit)
    .map((entry) => entry.character);
}

/* -------------------------------------------------------------------------- */
/*  Share                                                                     */
/* -------------------------------------------------------------------------- */

const SHARE_EMOJI = {
  correct: "🟩",
  partial: "🟨",
  incorrect: "🟥",
} as const;

function shareEmoji(cell: CellResult): string {
  if (cell.direction === "up") return "🟧";
  if (cell.direction === "down") return "🟪";
  return SHARE_EMOJI[cell.status];
}

export function buildShareText(
  results: GuessResult[],
  won: boolean,
  puzzleNumber: number,
): string {
  const score = won ? `${results.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const rows = results.map((result) =>
    result.cells.map(shareEmoji).join(""),
  );
  return [`SITCOMDLE #${puzzleNumber} ${score}`, ...rows].join("\n");
}
