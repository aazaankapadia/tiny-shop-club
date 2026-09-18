"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export function GameChrome({
  score,
  best,
  message,
  hint,
  onRestart,
  children,
}: {
  score?: number;
  best?: number;
  message?: string | null;
  hint?: string;
  onRestart?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#071018] text-[#e8eef8]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-sm">
        {score != null ? <span>Score {score}</span> : null}
        {best != null ? (
          <span className="text-[#9aa8bd]">Best {best}</span>
        ) : null}
        {message ? <span className="text-[#9ec4c8]">{message}</span> : null}
        {hint ? (
          <span className="text-xs text-[#7d8ca3]">{hint}</span>
        ) : null}
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="ml-auto rounded-full border border-[#334866] bg-[#1a2b45] px-3 py-1 text-xs font-semibold"
          >
            Restart
          </button>
        ) : (
          <span className="ml-auto" />
        )}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function useKeys() {
  const pressed = useRef(new Set<string>());
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      pressed.current.add(event.key);
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };
    const up = (event: KeyboardEvent) => {
      pressed.current.delete(event.key);
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return pressed;
}

export function useCanvasSize(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const size = useRef({ w: 800, h: 480 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [canvasRef]);
  return size;
}
