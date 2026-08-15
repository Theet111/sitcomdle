"use client";

import { COLUMNS, MAX_GUESSES, getInitials } from "@/lib/game";
import type { CellResult, Direction, GuessResult } from "@/lib/types";

const STATUS_CLASS = {
  correct: "sd-cell--correct",
  partial: "sd-cell--partial",
  incorrect: "sd-cell--incorrect",
} as const;

const STATUS_LABEL = {
  correct: "match",
  partial: "close",
  incorrect: "no match",
} as const;

function Arrow({ direction }: { direction: Direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`sd-arrow size-4 shrink-0 drop-shadow ${direction === "down" ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M12 3.5 20 14h-5v6.5H9V14H4z" />
    </svg>
  );
}

function CellBody({ cell }: { cell: CellResult }) {
  if (cell.key === "age" || cell.key === "debut") {
    return (
      <span className="flex items-center gap-1">
        <span className="font-mono text-lg leading-none font-extrabold tracking-tight sm:text-xl">
          {cell.value}
        </span>
        {cell.direction && <Arrow direction={cell.direction} />}
      </span>
    );
  }

  return (
    <>
      <span className="line-clamp-3 text-[10px] leading-[1.2] font-bold tracking-wide uppercase sm:text-[11px]">
        {cell.value}
      </span>
      {cell.detail && (
        <span className="line-clamp-1 text-[8px] font-semibold tracking-[0.1em] uppercase opacity-55 sm:text-[9px]">
          {cell.detail}
        </span>
      )}
    </>
  );
}

function AttributeCell({
  cell,
  index,
  animate,
  celebrate,
}: {
  cell: CellResult;
  index: number;
  animate: boolean;
  celebrate: boolean;
}) {
  return (
    <div
      role="cell"
      title={cell.full ?? cell.value}
      style={{ "--i": index } as React.CSSProperties}
      className={[
        "sd-cell",
        STATUS_CLASS[cell.status],
        animate ? "sd-reveal" : "",
        celebrate ? "sd-win" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CellBody cell={cell} />
      <span className="sr-only">{STATUS_LABEL[cell.status]}</span>
    </div>
  );
}

export function GridHeader() {
  return (
    <div role="row" className="sd-track mb-2.5">
      {COLUMNS.map((column) => (
        <div
          key={column.key}
          role="columnheader"
          title={column.hint}
          className={[
            "flex h-8 items-center text-[9px] font-black tracking-[0.16em] text-muted uppercase sm:text-[10px]",
            column.key === "character"
              ? "sd-sticky justify-start pl-1"
              : "justify-center text-center",
          ].join(" ")}
        >
          <span className="hidden sm:inline">{column.label}</span>
          <span className="sm:hidden">{column.shortLabel}</span>
        </div>
      ))}
    </div>
  );
}

function GuessRow({ result, animate }: { result: GuessResult; animate: boolean }) {
  const { character, cells, isWin } = result;

  return (
    <div role="row" className={`sd-track ${animate ? "sd-row-enter" : ""}`}>
      <div
        role="rowheader"
        title={`${character.name} — ${character.show.name}`}
        style={{ "--i": 0 } as React.CSSProperties}
        className={[
          "sd-cell sd-cell--name sd-sticky",
          animate ? "sd-reveal" : "",
          isWin ? "sd-win" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="flex w-full items-center gap-2">
          <span
            className="grid size-6 shrink-0 place-items-center rounded-md text-[9px] font-black"
            style={{
              background: `color-mix(in srgb, ${character.show.accent} 26%, transparent)`,
              color: character.show.accent,
            }}
            aria-hidden
          >
            {getInitials(character.name)}
          </span>
          <span className="min-w-0">
            <span className="line-clamp-2 text-[10px] leading-[1.15] font-black tracking-wide break-words uppercase sm:text-[11px]">
              {character.name}
            </span>
          </span>
        </span>
      </div>

      {cells.map((cell, index) => (
        <AttributeCell
          key={cell.key}
          cell={cell}
          index={index + 1}
          animate={animate}
          celebrate={isWin}
        />
      ))}
    </div>
  );
}

function EmptyRow() {
  return (
    <div role="row" className="sd-track" aria-hidden>
      <div className="sd-cell sd-cell--empty sd-sticky" />
      {COLUMNS.slice(1).map((column) => (
        <div key={column.key} className="sd-cell sd-cell--empty" />
      ))}
    </div>
  );
}

interface GuessGridProps {
  results: GuessResult[];
  /** Index of the row that should play the reveal choreography (restored rows stay still). */
  animatedIndex: number | null;
}

export function GuessGrid({ results, animatedIndex }: GuessGridProps) {
  const empties = Math.max(0, MAX_GUESSES - results.length);

  return (
    <div className="sd-scroll pb-2">
      <div role="table" aria-label="Guess history" className="min-w-max">
        <GridHeader />
        <div className="flex flex-col gap-2.5">
          {results.map((result, index) => (
            <GuessRow
              key={result.character.id}
              result={result}
              animate={index === animatedIndex}
            />
          ))}
          {Array.from({ length: empties }, (_, index) => (
            <EmptyRow key={`empty-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
