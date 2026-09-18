"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CLASS_NOTES,
  CLASS_SUBJECTS,
  type ClassNote,
} from "@/lib/class-notes-data";

export function NotesBrowser() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<(typeof CLASS_SUBJECTS)[number]>("All");

  const notes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CLASS_NOTES.filter((note) => {
      if (subject !== "All" && note.subject !== subject) return false;
      if (!needle) return true;
      return (
        note.title.toLowerCase().includes(needle) ||
        note.summary.toLowerCase().includes(needle) ||
        note.subject.toLowerCase().includes(needle)
      );
    });
  }, [query, subject]);

  return (
    <div className="mx-auto w-full max-w-[920px] px-[18px] pb-[72px] pt-7">
      <header className="flex max-w-xl flex-col gap-2.5">
        <h1 className="notes-serif text-[clamp(2.4rem,7vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          Class Notes
        </h1>
        <p className="max-w-[36ch] text-[1.05rem] leading-6 text-[var(--notes-muted)]">
          Shared outlines, study guides, and lecture summaries for this term.
        </p>
      </header>

      <div className="mt-[22px] flex flex-wrap items-center gap-2.5">
        <label className="sr-only" htmlFor="notes-search">
          Search notes
        </label>
        <input
          id="notes-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Search notes…"
          autoComplete="off"
          className="min-w-0 flex-[1_1_220px] rounded-full border border-[var(--notes-line)] bg-white px-4 py-3 text-[var(--notes-ink)] shadow-[var(--notes-shadow)] outline-none focus:border-[#9ec4c8] focus:shadow-[0_0_0_3px_rgba(15,110,117,0.12)]"
        />
        <div className="flex flex-wrap gap-2">
          {CLASS_SUBJECTS.map((item) => {
            const active = item === subject;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setSubject(item)}
                className={`rounded-full px-3 py-2 text-[0.85rem] font-semibold transition ${
                  active
                    ? "border border-[var(--notes-accent)] bg-[var(--notes-accent)] text-white"
                    : "border border-[var(--notes-line)] bg-white text-[var(--notes-muted)] hover:-translate-y-px"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-[18px] mb-2.5 text-[0.88rem] text-[var(--notes-muted)]">
        {notes.length} note{notes.length === 1 ? "" : "s"}
      </p>

      <ul className="flex flex-col gap-2">
        {notes.map((note) => (
          <li key={note.id}>
            <NoteRow note={note} />
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href="/notes/review"
          className="text-sm font-semibold text-[var(--notes-accent)] hover:underline"
        >
          Practice
        </Link>
      </div>
    </div>
  );
}

function NoteRow({ note }: { note: ClassNote }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-[14px] border border-transparent bg-white/72 px-4 py-3.5 text-left backdrop-blur-[6px] transition hover:-translate-y-px hover:border-[#b9d3d6] hover:bg-white hover:shadow-[var(--notes-shadow)]"
    >
      <p className="col-span-full text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--notes-accent)]">
        {note.subject}
      </p>
      <h2 className="notes-serif text-[1.12rem] font-bold">{note.title}</h2>
      <p className="text-sm text-[var(--notes-muted)]">{note.week}</p>
    </Link>
  );
}
