"use client";

import { useState } from "react";
import { POLYTRACK_MAPS, type PolytrackMap } from "@/lib/polytrack-maps";

const OFFICIAL_GAME = "https://kodub.itch.io/polytrack";
const SOURCE_REPO =
  "https://github.com/TiniTheBagel/polytrack-import-codes";

export function PolytrackMaps() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function copyMap(map: PolytrackMap) {
    setBusyId(map.id);
    setErrorId(null);
    try {
      const res = await fetch(map.file);
      if (!res.ok) throw new Error("Could not load map code");
      const code = (await res.text()).trim();
      await navigator.clipboard.writeText(code);
      setCopiedId(map.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === map.id ? null : current));
      }, 1800);
    } catch {
      setErrorId(map.id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-auto bg-[#0e1218] text-[#f3f5f8]">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <h2 className="notes-serif text-2xl font-bold tracking-tight">
          Polytrack import codes
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9aa8bd]">
          Community track codes hosted on this site. Open the official Polytrack
          game, then paste an import code to load the map.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={OFFICIAL_GAME}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#b6f23a] px-4 py-2 text-sm font-semibold text-[#0e1218] no-underline"
          >
            Open official Polytrack
          </a>
          <a
            href={SOURCE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#334866] px-4 py-2 text-sm font-semibold text-[#e8eef8] no-underline"
          >
            Map source on GitHub
          </a>
        </div>

        <ul className="mt-6 flex flex-col gap-2">
          {POLYTRACK_MAPS.map((map) => (
            <li
              key={map.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#243552] bg-[#121a26] px-4 py-3"
            >
              <div>
                <p className="font-semibold">{map.name}</p>
                {map.lite ? (
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.04em] text-[#7dd3c0]">
                    Lite · less scenery
                  </p>
                ) : null}
                {errorId === map.id ? (
                  <p className="mt-1 text-xs text-[#ff8f8f]">
                    Could not copy — try again
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => copyMap(map)}
                disabled={busyId === map.id}
                className="rounded-full border border-[#334866] bg-[#1a2b45] px-3.5 py-2 text-sm font-semibold text-[#e8eef8] disabled:opacity-60"
              >
                {busyId === map.id
                  ? "Loading…"
                  : copiedId === map.id
                    ? "Copied"
                    : "Copy import code"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
