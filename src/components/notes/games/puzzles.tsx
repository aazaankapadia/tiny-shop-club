"use client";

import { useEffect, useRef, useState } from "react";
import { GameChrome } from "@/components/notes/games/kit";

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function Merge2048() {
  const empty = () =>
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  const [grid, setGrid] = useState<number[][]>(() => spawn(spawn(empty())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  function spawn(board: number[][]) {
    const spots: [number, number][] = [];
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell === 0) spots.push([x, y]);
      }),
    );
    if (!spots.length) return board;
    const [x, y] = spots[Math.floor(Math.random() * spots.length)];
    const next = board.map((row) => [...row]);
    next[y][x] = Math.random() < 0.9 ? 2 : 4;
    return next;
  }

  function slide(row: number[]) {
    const nums = row.filter((n) => n !== 0);
    const out: number[] = [];
    let gained = 0;
    for (let i = 0; i < nums.length; i += 1) {
      if (nums[i] === nums[i + 1]) {
        out.push(nums[i] * 2);
        gained += nums[i] * 2;
        i += 1;
      } else {
        out.push(nums[i]);
      }
    }
    while (out.length < 4) out.push(0);
    return { row: out, gained };
  }

  function move(dir: "l" | "r" | "u" | "d") {
    if (over) return;
    let next = grid.map((row) => [...row]);
    let gained = 0;
    const apply = (get: (x: number, y: number) => number, set: (x: number, y: number, v: number) => void) => {
      for (let y = 0; y < 4; y += 1) {
        const line = [0, 1, 2, 3].map((x) => get(x, y));
        const slid = slide(dir === "r" || dir === "d" ? line.reverse() : line);
        const values = dir === "r" || dir === "d" ? slid.row.reverse() : slid.row;
        values.forEach((value, x) => set(x, y, value));
        gained += slid.gained;
      }
    };
    if (dir === "l" || dir === "r") {
      apply(
        (x, y) => next[y][x],
        (x, y, v) => {
          next[y][x] = v;
        },
      );
    } else {
      apply(
        (x, y) => next[x][y],
        (x, y, v) => {
          next[x][y] = v;
        },
      );
    }
    const changed = JSON.stringify(next) !== JSON.stringify(grid);
    if (!changed) return;
    next = spawn(next);
    setGrid(next);
    setScore((value) => value + gained);
    if (!canAny(next)) setOver(true);
  }

  function canAny(board: number[][]) {
    if (board.some((row) => row.includes(0))) return true;
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        const n = board[y][x];
        if (board[y][x + 1] === n || board[y + 1]?.[x] === n) return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const map: Record<string, "l" | "r" | "u" | "d"> = {
        ArrowLeft: "l",
        ArrowRight: "r",
        ArrowUp: "u",
        ArrowDown: "d",
      };
      const dir = map[event.key];
      if (!dir) return;
      event.preventDefault();
      move(dir);
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <GameChrome
      score={score}
      message={over ? "No moves left" : null}
      hint="Arrow keys to slide"
      onRestart={() => {
        setGrid(spawn(spawn(empty())));
        setScore(0);
        setOver(false);
      }}
    >
      <div className="flex h-full items-center justify-center p-4">
        <div className="grid w-full max-w-sm grid-cols-4 gap-2 rounded-2xl bg-[#1a2b45] p-3">
          {grid.flatMap((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="flex aspect-square items-center justify-center rounded-lg text-2xl font-bold"
                style={{
                  background: cell ? `hsl(${200 - Math.log2(cell) * 12} 40% 30%)` : "#121f33",
                  color: "#e8eef8",
                }}
              >
                {cell || ""}
              </div>
            )),
          )}
        </div>
      </div>
    </GameChrome>
  );
}

export function MemoryMatch() {
  const [cards, setCards] = useState(() => deal());
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const done = cards.every((card) => card.matched);

  function deal() {
    const values = shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]);
    return values.map((value, id) => ({ id, value, matched: false }));
  }

  function flip(index: number) {
    if (open.length === 2 || cards[index].matched || open.includes(index)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      const [a, b] = next;
      if (cards[a].value === cards[b].value) {
        setCards((list) =>
          list.map((card, i) =>
            i === a || i === b ? { ...card, matched: true } : card,
          ),
        );
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 700);
      }
    }
  }

  return (
    <GameChrome
      score={moves}
      message={done ? "Matched all pairs" : null}
      hint="Find the pairs"
      onRestart={() => {
        setCards(deal());
        setOpen([]);
        setMoves(0);
      }}
    >
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 content-center gap-2 p-4">
        {cards.map((card, index) => {
          const show = card.matched || open.includes(index);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(index)}
              className="aspect-square rounded-xl text-2xl font-bold"
              style={{
                background: show ? "#1a2b45" : "#0f6e75",
                color: "#e8eef8",
              }}
            >
              {show ? card.value : "?"}
            </button>
          );
        })}
      </div>
    </GameChrome>
  );
}

export function WhackTile() {
  const [active, setActive] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(20);
  const over = left <= 0;

  useEffect(() => {
    if (over) return;
    const timer = window.setInterval(() => {
      setActive(Math.floor(Math.random() * 9));
      setLeft((value) => value - 1);
    }, 700);
    return () => window.clearInterval(timer);
  }, [over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Time's up" : `${left}s left`}
      hint="Hit the lit tile"
      onRestart={() => {
        setScore(0);
        setLeft(20);
      }}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-3 content-center gap-3 p-6">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (index === active && !over) setScore((value) => value + 1);
            }}
            className="aspect-square rounded-2xl"
            style={{ background: index === active ? "#3ee0c4" : "#1a2b45" }}
          />
        ))}
      </div>
    </GameChrome>
  );
}

export function ReactionTest() {
  const [mode, setMode] = useState<"wait" | "go" | "early" | "done">("wait");
  const [ms, setMs] = useState<number | null>(null);
  const startAt = useRef(0);

  useEffect(() => {
    if (mode !== "wait") return;
    const delay = 800 + Math.random() * 2200;
    const timer = window.setTimeout(() => {
      startAt.current = performance.now();
      setMode("go");
    }, delay);
    return () => window.clearTimeout(timer);
  }, [mode]);

  function tap() {
    if (mode === "wait") setMode("early");
    else if (mode === "go") {
      setMs(Math.round(performance.now() - startAt.current));
      setMode("done");
    }
  }

  return (
    <GameChrome
      message={
        mode === "done"
          ? `${ms} ms`
          : mode === "early"
            ? "Too soon"
            : mode === "go"
              ? "Tap!"
              : "Wait for green"
      }
      onRestart={() => {
        setMode("wait");
        setMs(null);
      }}
    >
      <button
        type="button"
        onClick={tap}
        className="h-full w-full text-2xl font-semibold"
        style={{
          background:
            mode === "go" ? "#1f8f63" : mode === "early" ? "#8a3b3b" : "#1a2b45",
        }}
      >
        {mode === "go" ? "Now" : mode === "wait" ? "Wait…" : "Try again"}
      </button>
    </GameChrome>
  );
}

export function SimonSays() {
  const colors = ["#e06b6b", "#3ee0c4", "#f4d27a", "#7aa0c2"];
  const [seq, setSeq] = useState<number[]>(() => [Math.floor(Math.random() * 4)]);
  const [step, setStep] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!playing || over) return;
    let i = 0;
    const timer = window.setInterval(() => {
      setFlash(seq[i]);
      window.setTimeout(() => setFlash(null), 280);
      i += 1;
      if (i >= seq.length) {
        window.clearInterval(timer);
        setPlaying(false);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [seq, playing, over]);

  function press(index: number) {
    if (playing || over) return;
    if (index !== seq[step]) {
      setOver(true);
      return;
    }
    if (step + 1 === seq.length) {
      setSeq((list) => [...list, Math.floor(Math.random() * 4)]);
      setStep(0);
      setPlaying(true);
    } else {
      setStep((value) => value + 1);
    }
  }

  return (
    <GameChrome
      score={seq.length - 1}
      message={over ? "Wrong color" : playing ? "Watch" : "Repeat"}
      onRestart={() => {
        setSeq([Math.floor(Math.random() * 4)]);
        setStep(0);
        setPlaying(true);
        setOver(false);
      }}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-2 content-center gap-3 p-6">
        {colors.map((color, index) => (
          <button
            key={color}
            type="button"
            onClick={() => press(index)}
            className="aspect-square rounded-3xl"
            style={{
              background: color,
              opacity: flash === index ? 1 : 0.45,
            }}
          />
        ))}
      </div>
    </GameChrome>
  );
}

function winner(board: Array<"X" | "O" | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw" as const;
  return null;
}

function bestMove(board: Array<"X" | "O" | null>) {
  const empty = board
    .map((cell, i) => (cell ? -1 : i))
    .filter((i) => i >= 0);
  let choice = empty[0];
  let best = -Infinity;
  for (const index of empty) {
    const next = [...board];
    next[index] = "O";
    const value = minimax(next, false);
    if (value > best) {
      best = value;
      choice = index;
    }
  }
  return choice;
}

function minimax(board: Array<"X" | "O" | null>, cpu: boolean): number {
  const w = winner(board);
  if (w === "O") return 1;
  if (w === "X") return -1;
  if (w === "draw") return 0;
  const empty = board
    .map((cell, i) => (cell ? -1 : i))
    .filter((i) => i >= 0);
  if (cpu) {
    return Math.max(
      ...empty.map((index) => {
        const next = [...board];
        next[index] = "O";
        return minimax(next, false);
      }),
    );
  }
  return Math.min(
    ...empty.map((index) => {
      const next = [...board];
      next[index] = "X";
      return minimax(next, true);
    }),
  );
}

export function TicTacToe() {
  const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const result = winner(board);

  useEffect(() => {
    if (result || board.filter(Boolean).length % 2 === 0) return;
    const timer = window.setTimeout(() => {
      const index = bestMove(board);
      setBoard((list) => list.map((cell, i) => (i === index ? "O" : cell)));
    }, 280);
    return () => window.clearTimeout(timer);
  }, [board, result]);

  return (
    <GameChrome
      message={
        result === "X" ? "You win" : result === "O" ? "CPU wins" : result === "draw" ? "Draw" : "Your turn"
      }
      onRestart={() => setBoard(Array(9).fill(null))}
    >
      <div className="mx-auto grid h-full max-w-sm grid-cols-3 content-center gap-2 p-6">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (cell || result || board.filter(Boolean).length % 2 !== 0) return;
              setBoard((list) => list.map((item, i) => (i === index ? "X" : item)));
            }}
            className="aspect-square rounded-xl bg-[#1a2b45] text-4xl font-bold text-[#e8eef8]"
          >
            {cell}
          </button>
        ))}
      </div>
    </GameChrome>
  );
}

export function SpeedMath() {
  const [problem, setProblem] = useState(() => make());
  const [value, setValue] = useState("");
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(30);
  const over = left <= 0;

  useEffect(() => {
    if (over) return;
    const timer = window.setInterval(() => setLeft((n) => n - 1), 1000);
    return () => window.clearInterval(timer);
  }, [over]);

  function make() {
    const a = 2 + Math.floor(Math.random() * 12);
    const b = 2 + Math.floor(Math.random() * 12);
    const op = Math.random() > 0.5 ? "+" : "×";
    return { text: `${a} ${op} ${b}`, answer: op === "+" ? a + b : a * b };
  }

  function submit() {
    if (Number(value) === problem.answer) {
      setScore((n) => n + 1);
      setProblem(make());
      setValue("");
    } else {
      setValue("");
    }
  }

  return (
    <GameChrome
      score={score}
      message={over ? "Time's up" : `${left}s`}
      hint="Type the answer"
      onRestart={() => {
        setScore(0);
        setLeft(30);
        setProblem(make());
        setValue("");
      }}
    >
      <form
        className="flex h-full flex-col items-center justify-center gap-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!over) submit();
        }}
      >
        <p className="notes-serif text-5xl">{problem.text}</p>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          inputMode="numeric"
          className="w-40 rounded-full bg-[#1a2b45] px-4 py-3 text-center text-xl outline-none"
          autoFocus
        />
      </form>
    </GameChrome>
  );
}

export function NumberOrder() {
  const [nums, setNums] = useState(() => shuffle(Array.from({ length: 16 }, (_, i) => i + 1)));
  const [next, setNext] = useState(1);
  const done = next > 16;

  return (
    <GameChrome
      score={next - 1}
      message={done ? "Cleared" : `Next ${next}`}
      onRestart={() => {
        setNums(shuffle(Array.from({ length: 16 }, (_, i) => i + 1)));
        setNext(1);
      }}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-4 content-center gap-2 p-4">
        {nums.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => {
              if (num === next) setNext((value) => value + 1);
            }}
            className="aspect-square rounded-xl text-xl font-bold"
            style={{
              background: num < next ? "#122033" : "#1a2b45",
              color: num < next ? "#334866" : "#e8eef8",
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </GameChrome>
  );
}

export function MinesLite() {
  const size = 8;
  const mines = 10;
  const [cells, setCells] = useState(() => build());
  const lost = cells.some((cell) => cell.open && cell.mine);
  const won =
    !lost && cells.filter((cell) => cell.open).length === size * size - mines;

  function build() {
    const mineAt = new Set<number>();
    while (mineAt.size < mines) mineAt.add(Math.floor(Math.random() * size * size));
    return Array.from({ length: size * size }, (_, i) => {
      const x = i % size;
      const y = Math.floor(i / size);
      let n = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (mineAt.has(ny * size + nx)) n += 1;
        }
      }
      return { mine: mineAt.has(i), n, open: false };
    });
  }

  function reveal(index: number) {
    setCells((list) => {
      const next = list.map((cell) => ({ ...cell }));
      const visit = [index];
      while (visit.length) {
        const i = visit.pop()!;
        if (next[i].open) continue;
        next[i].open = true;
        if (next[i].mine || next[i].n > 0) continue;
        const x = i % size;
        const y = Math.floor(i / size);
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
            visit.push(ny * size + nx);
          }
        }
      }
      return next;
    });
  }

  return (
    <GameChrome
      message={lost ? "Hit a mine" : won ? "Cleared" : "Find the clear tiles"}
      onRestart={() => setCells(build())}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-8 content-center gap-1 p-4">
        {cells.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (!lost && !won && !cell.open) reveal(index);
            }}
            className="aspect-square rounded text-sm font-bold"
            style={{
              background: cell.open ? (cell.mine ? "#8a3b3b" : "#1a2b45") : "#0f6e75",
              color: "#e8eef8",
            }}
          >
            {cell.open ? (cell.mine ? "•" : cell.n || "") : ""}
          </button>
        ))}
      </div>
    </GameChrome>
  );
}

export function ColorMatch() {
  const colors = [
    { name: "Teal", value: "#3ee0c4" },
    { name: "Gold", value: "#f4d27a" },
    { name: "Rose", value: "#e06b6b" },
    { name: "Blue", value: "#7aa0c2" },
  ];
  const [target, setTarget] = useState(colors[0]);
  const [ink, setInk] = useState(colors[1]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(20);
  const over = left <= 0;

  useEffect(() => {
    if (over) return;
    const timer = window.setInterval(() => setLeft((n) => n - 1), 1000);
    return () => window.clearInterval(timer);
  }, [over]);

  function nextRound() {
    setTarget(colors[Math.floor(Math.random() * colors.length)]);
    setInk(colors[Math.floor(Math.random() * colors.length)]);
  }

  return (
    <GameChrome
      score={score}
      message={over ? "Time's up" : `${left}s`}
      hint="Tap the color of the word, not the word"
      onRestart={() => {
        setScore(0);
        setLeft(20);
        nextRound();
      }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
        <p className="notes-serif text-5xl font-bold" style={{ color: ink.value }}>
          {target.name}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => {
                if (over) return;
                if (color.value === ink.value) {
                  setScore((n) => n + 1);
                  nextRound();
                }
              }}
              className="h-16 w-28 rounded-full"
              style={{ background: color.value }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>
    </GameChrome>
  );
}

export function DotConnect() {
  const [order] = useState(() =>
    shuffle(
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        x: 18 + (i % 4) * 22 + Math.random() * 6,
        y: 24 + Math.floor(i / 4) * 36 + Math.random() * 8,
      })),
    ).map((dot, i) => ({ ...dot, id: i + 1 })),
  );
  const [path, setPath] = useState<number[]>([]);
  const next = path.length + 1;
  const done = path.length === order.length;

  return (
    <GameChrome
      score={path.length}
      message={done ? "Path complete" : `Connect ${next}`}
      onRestart={() => setPath([])}
    >
      <div className="relative h-full w-full">
        <svg className="h-full w-full">
          {path.length > 1
            ? path.slice(1).map((id, index) => {
                const a = order.find((dot) => dot.id === path[index])!;
                const b = order.find((dot) => dot.id === id)!;
                return (
                  <line
                    key={`${a.id}-${b.id}`}
                    x1={`${a.x}%`}
                    y1={`${a.y}%`}
                    x2={`${b.x}%`}
                    y2={`${b.y}%`}
                    stroke="#3ee0c4"
                    strokeWidth="4"
                  />
                );
              })
            : null}
        </svg>
        {order.map((dot) => (
          <button
            key={dot.id}
            type="button"
            onClick={() => {
              if (dot.id === next) setPath((list) => [...list, dot.id]);
            }}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full text-sm font-bold"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              background: path.includes(dot.id) ? "#3ee0c4" : "#1a2b45",
              color: "#071018",
            }}
          >
            {dot.id}
          </button>
        ))}
      </div>
    </GameChrome>
  );
}
