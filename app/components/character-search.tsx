"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchCharacters } from "@/lib/game";
import type { Character } from "@/lib/types";

interface CharacterSearchProps {
  guessedIds: string[];
  disabled: boolean;
  onSelect: (character: Character) => void;
}

/** Splits a name around the typed query so the match can be highlighted. */
function highlight(name: string, query: string) {
  const index = name.toLowerCase().indexOf(query.toLowerCase());
  if (query.length === 0 || index < 0) return [name, "", ""] as const;
  return [
    name.slice(0, index),
    name.slice(index, index + query.length),
    name.slice(index + query.length),
  ] as const;
}

export function CharacterSearch({ guessedIds, disabled, onSelect }: CharacterSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const guessed = useMemo(() => new Set(guessedIds), [guessedIds]);
  const results = useMemo(() => searchCharacters(query), [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function submit(character: Character) {
    if (disabled || guessed.has(character.id)) return;
    onSelect(character);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const choice = results[active];
      if (choice) submit(choice);
    }
  }

  const showList = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <div
        className={[
          "group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors sm:px-5 sm:py-4",
          disabled
            ? "border-white/5 bg-[var(--surface)] opacity-60"
            : "border-white/10 bg-[var(--surface-2)] hover:border-white/20 focus-within:border-[var(--accent-3)]",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          className="size-5 shrink-0 text-muted transition-colors group-focus-within:text-white"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="SEARCH FOR A CHARACTER..."
          className="w-full bg-transparent text-sm font-semibold tracking-[0.04em] text-text outline-none placeholder:text-[#696969] disabled:cursor-not-allowed sm:text-base"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="shrink-0 rounded-full p-1 text-faint transition-colors hover:text-text"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="size-4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="sd-fade-up absolute inset-x-0 top-[calc(100%+8px)] max-h-[336px] overflow-y-auto rounded-xl border border-white/10 bg-[var(--surface)] p-1.5 shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
        >
          {results.length === 0 && (
            <li className="px-4 py-4 text-center text-xs font-semibold tracking-[0.14em] text-faint uppercase">
              No character found
            </li>
          )}

          {results.map((character, index) => {
            const alreadyGuessed = guessed.has(character.id);
            const [before, match, after] = highlight(character.name, query.trim());
            return (
              <li key={character.id} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  disabled={alreadyGuessed}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => submit(character)}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    alreadyGuessed
                      ? "cursor-not-allowed opacity-40"
                      : index === active
                        ? "bg-white/[0.08]"
                        : "hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold tracking-wide text-text uppercase">
                      {before}
                      <mark className="bg-transparent text-[var(--accent-2)]">{match}</mark>
                      {after}
                    </span>
                    <span className="block truncate text-[11px] font-medium tracking-wide text-faint">
                      {character.show.name}
                    </span>
                  </span>

                  {alreadyGuessed && (
                    <span className="shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-faint uppercase">
                      Guessed
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
