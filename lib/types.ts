/**
 * Shared domain types for the Sitcomdle attribute grid.
 *
 * The data layer (shows.ts / characters.ts) is intentionally free of any UI
 * concerns so new sitcoms and characters can be added without touching React.
 */

/** How the show is shot — used as a meaningful partial match on the SITCOM column. */
export type ShowFormat = "Mockumentary" | "Multi-cam" | "Single-cam";

export type Gender = "Male" | "Female";

/**
 * Ordinal on purpose: adjacent tiers count as a partial match.
 * Lead = the protagonist the show is built around.
 * Main = opening-credits ensemble regular.
 * Supporting = regular, but outside the core ensemble.
 * Recurring = returns across arcs without being a regular.
 */
export type CharacterRole = "Lead" | "Main" | "Supporting" | "Recurring";

export interface Show {
  id: string;
  name: string;
  /** Short label used on compact cells / avatars. */
  short: string;
  format: ShowFormat;
  /** Shared/spin-off universe key. Partial match when equal. */
  universe?: string;
  premiere: number;
  seasons: number;
  /** Primary setting of the show. */
  city: string;
  /** State / province — a partial match on the LOCATION column. */
  region: string;
  country: string;
  /** Accent colour used for the character avatar chip. */
  accent: string;
}

/** A character as authored in the database. */
export interface CharacterSeed {
  id: string;
  name: string;
  showId: string;
  gender: Gender;
  role: CharacterRole;
  /** Best-known job title. Kept short so it stays readable inside a cell. */
  occupation: string;
  /** Broader career field — a partial match on the OCCUPATION column. */
  field: string;
  /** Age at first appearance. */
  age: number;
  /** Season of first appearance. */
  debutSeason: number;
  /** Optional overrides for characters who live away from the show's main setting. */
  city?: string;
  region?: string;
}

/** A character with its show data flattened in — what the game logic and UI consume. */
export interface Character extends CharacterSeed {
  show: Show;
  city: string;
  region: string;
  country: string;
}

export type CellStatus = "correct" | "partial" | "incorrect";

export type Direction = "up" | "down";

/** Every comparable column of the grid. `character` is the label column, never scored. */
export type ColumnKey =
  | "character"
  | "show"
  | "gender"
  | "role"
  | "occupation"
  | "location"
  | "age"
  | "debut";

export interface CellResult {
  key: ColumnKey;
  status: CellStatus;
  /** Primary value rendered in the cell. */
  value: string;
  /** Optional second line (e.g. the state under a city). */
  detail?: string;
  /** Set for numeric columns when the target's value is higher / lower. */
  direction?: Direction;
  /** Full text for the `title` tooltip when the value is truncated. */
  full?: string;
}

export interface GuessResult {
  character: Character;
  cells: CellResult[];
  isWin: boolean;
}

export type GameMode = "daily" | "duel" | "infinite";

export type GameStatus = "playing" | "won" | "lost";
