"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GameHost } from "@/components/notes/games/host";
import { PRACTICE_TOPICS, getPracticeTopic } from "@/lib/practice-topics";

export function PracticeBrowser() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const topics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return PRACTICE_TOPICS;
    return PRACTICE_TOPICS.filter(
      (topic) =>
        topic.name.toLowerCase().includes(needle) ||
        topic.tag.toLowerCase().includes(needle),
    );
  }, [query]);

  const current = openId ? getPracticeTopic(openId) : null;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = current ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [current]);

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 pb-10 pt-[22px]">
      <header className="mb-3.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/notes"
            className="text-[0.85rem] font-semibold text-[var(--notes-muted)] no-underline hover:text-[var(--notes-ink)]"
          >
            ← Class Notes
          </Link>
          <h1 className="notes-serif mt-1.5 text-[clamp(1.8rem,5vw,2.4rem)] tracking-[-0.02em]">
            Practice Tools
          </h1>
          <p className="mt-1.5 max-w-[40ch] leading-[1.45] text-[var(--notes-muted)]">
            Optional drills and short activities for review sessions.
          </p>
        </div>
        <label className="sr-only" htmlFor="practice-search">
          Search topics
        </label>
        <input
          id="practice-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Search topics…"
          autoComplete="off"
          className="w-full max-w-[280px] rounded-full border border-[var(--notes-line)] bg-white px-3.5 py-[11px] shadow-[var(--notes-shadow)] outline-none focus:border-[#9ec4c8] focus:shadow-[0_0_0_3px_rgba(15,110,117,0.12)]"
        />
      </header>

      <p className="mb-3 text-[0.88rem] text-[var(--notes-muted)]">
        {topics.length} topic{topics.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setOpenId(topic.id)}
            className="flex w-full items-center justify-between gap-3 rounded-[14px] border border-transparent bg-white/75 px-3.5 py-3 text-left transition hover:-translate-y-px hover:border-[#b9d3d6] hover:bg-white hover:shadow-[var(--notes-shadow)]"
          >
            <strong className="notes-serif font-bold">{topic.name}</strong>
            <span className="whitespace-nowrap text-[0.78rem] font-semibold uppercase tracking-[0.03em] text-[var(--notes-muted)]">
              {topic.tag}
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <section
          className="fixed inset-0 z-20 flex flex-col bg-[#0b1524]"
          aria-label="Viewer"
        >
          <div className="flex items-center gap-2.5 border-b border-[#243552] bg-[#121f33] px-3 py-2.5 text-[#e8eef8]">
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="rounded-full border border-[#334866] bg-[#1a2b45] px-3 py-2 text-[0.85rem] font-semibold"
            >
              Back
            </button>
            <strong className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {current.name}
            </strong>
            {current.url ? (
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#334866] bg-[#1a2b45] px-3 py-2 text-[0.85rem] font-semibold text-[#e8eef8] no-underline"
              >
                Open
              </a>
            ) : null}
          </div>
          <div className="min-h-0 flex-1">
            <GameHost id={current.id} url={current.url} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
