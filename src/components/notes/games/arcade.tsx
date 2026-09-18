"use client";

import { useEffect, useRef, useState } from "react";
import { GameChrome, useCanvasSize, useKeys } from "@/components/notes/games/kit";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function StickDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let alive = true;
    const gaps: { x: number; w: number }[] = [];
    let dist = 0;
    let next = 280;
    let y = 0;
    let vy = 0;
    let grounded = true;
    let last = performance.now();
    let pointer = false;

    const onDown = () => {
      pointer = true;
    };
    const onUp = () => {
      pointer = false;
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const { w, h } = size.current;
      const ground = h * 0.72;
      const speed = 5.2 + dist * 0.002;
      dist += speed * dt;
      next -= speed * dt;
      if (next < 0) {
        gaps.push({ x: w + 20, w: rand(52, 92) });
        next = rand(180, 320);
      }
      for (const gap of gaps) gap.x -= speed * dt;
      while (gaps.length && gaps[0].x + gaps[0].w < -20) gaps.shift();

      const wantJump =
        pointer ||
        keys.current.has(" ") ||
        keys.current.has("ArrowUp");
      if (wantJump && grounded) {
        vy = -13.4;
        grounded = false;
      }
      vy += 0.62 * dt;
      y += vy * dt;
      if (y > 0) {
        y = 0;
        vy = 0;
        grounded = true;
      }

      const px = w * 0.22;
      const py = ground + y;
      const overGap = gaps.some(
        (gap) => px > gap.x + 6 && px < gap.x + gap.w - 6,
      );
      if (grounded && overGap) {
        alive = false;
        setScore(Math.floor(dist / 8));
        setBest((value) => Math.max(value, Math.floor(dist / 8)));
        setOver(true);
        return;
      }

      ctx.fillStyle = "#08131f";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#122033";
      ctx.fillRect(0, ground, w, h - ground);
      ctx.fillStyle = "#0b1524";
      for (const gap of gaps) ctx.fillRect(gap.x, ground - 1, gap.w, h);
      ctx.fillStyle = "#9ec4c8";
      ctx.fillRect(px - 7, py - 34, 14, 34);
      ctx.beginPath();
      ctx.arc(px, py - 42, 7, 0, Math.PI * 2);
      ctx.fill();
      setScore(Math.floor(dist / 8));
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      best={best}
      message={over ? "Fell in a gap" : null}
      hint="Tap / space to jump"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function NeonLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let angle = 0;
    let marker = 0;
    let speed = 0.045;
    let points = 0;
    let last = performance.now();
    let alive = true;
    const gap = 0.42;

    const tap = () => {
      if (!alive) return;
      const diff = Math.abs((((marker - angle) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
      const aligned = diff < gap / 2 || diff > Math.PI * 2 - gap / 2;
      if (aligned) {
        points += 1;
        speed += 0.004;
        marker += rand(1.2, 4.2);
        setScore(points);
      } else {
        alive = false;
        setBest((value) => Math.max(value, points));
        setOver(true);
      }
    };
    canvas.addEventListener("pointerdown", tap);
    const key = (event: KeyboardEvent) => {
      if (event.key === " ") tap();
    };
    window.addEventListener("keydown", key);

    const frame = (now: number) => {
      if (local !== run.current) return;
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      if (alive) angle += speed * dt;
      const { w, h } = size.current;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.28;
      ctx.fillStyle = "#070d18";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#1d3a4a";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle + gap / 2, angle + Math.PI * 2 - gap / 2);
      ctx.stroke();
      ctx.strokeStyle = "#3ee0c4";
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle - gap / 2, angle + gap / 2);
      ctx.stroke();
      const mx = cx + Math.cos(marker) * r;
      const my = cy + Math.sin(marker) * r;
      ctx.fillStyle = "#f4f7ff";
      ctx.beginPath();
      ctx.arc(mx, my, 8, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      canvas.removeEventListener("pointerdown", tap);
      window.removeEventListener("keydown", key);
    };
  }, [size, over]);

  return (
    <GameChrome
      score={score}
      best={best}
      message={over ? "Missed the gap" : null}
      hint="Tap when the marker hits the bright gap"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function SlopeRush() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);
  const pointerX = useRef<number | null>(null);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let x = 0.5;
    let speed = 6;
    let dist = 0;
    const blocks: { x: number; y: number; w: number }[] = [];
    let spawn = 0;
    let last = performance.now();
    let alive = true;

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX.current = (event.clientX - rect.left) / rect.width;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", move);

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const { w, h } = size.current;
      if (keys.current.has("ArrowLeft") || keys.current.has("a")) x -= 0.018 * dt;
      if (keys.current.has("ArrowRight") || keys.current.has("d")) x += 0.018 * dt;
      if (pointerX.current != null) x += (pointerX.current - x) * 0.2;
      x = Math.max(0.12, Math.min(0.88, x));
      speed += 0.003 * dt;
      dist += speed * dt;
      spawn -= speed * dt;
      if (spawn < 0) {
        blocks.push({ x: rand(0.12, 0.88), y: -40, w: rand(46, 90) });
        spawn = rand(70, 140);
      }
      for (const block of blocks) block.y += speed * dt;
      while (blocks.length && blocks[0].y > h + 40) blocks.shift();
      const px = x * w;
      const py = h * 0.72;
      const hit = blocks.some(
        (block) =>
          Math.abs(px - block.x * w) < block.w * 0.45 &&
          Math.abs(py - block.y) < 28,
      );
      if (hit) {
        alive = false;
        const points = Math.floor(dist / 10);
        setScore(points);
        setBest((value) => Math.max(value, points));
        setOver(true);
        return;
      }
      ctx.fillStyle = "#101820";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#1d3344";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, 0);
      ctx.lineTo(w * 0.08, h);
      ctx.moveTo(w * 0.92, 0);
      ctx.lineTo(w * 0.92, h);
      ctx.stroke();
      ctx.fillStyle = "#c45c5c";
      for (const block of blocks) {
        ctx.fillRect(block.x * w - block.w / 2, block.y - 14, block.w, 28);
      }
      ctx.fillStyle = "#7ee0d0";
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.fill();
      setScore(Math.floor(dist / 10));
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      best={best}
      message={over ? "Crashed" : null}
      hint="Left / right or drag"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function ByteSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    const cols = 24;
    const rows = 16;
    let snake = [
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 4, y: 8 },
    ];
    let dir = { x: 1, y: 0 };
    let pending = dir;
    let food = { x: 14, y: 8 };
    let acc = 0;
    let last = performance.now();
    let alive = true;

    const placeFood = () => {
      food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
      if (snake.some((part) => part.x === food.x && part.y === food.y)) placeFood();
    };

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = now - last;
      last = now;
      if (keys.current.has("ArrowUp") && dir.y !== 1) pending = { x: 0, y: -1 };
      if (keys.current.has("ArrowDown") && dir.y !== -1) pending = { x: 0, y: 1 };
      if (keys.current.has("ArrowLeft") && dir.x !== 1) pending = { x: -1, y: 0 };
      if (keys.current.has("ArrowRight") && dir.x !== -1) pending = { x: 1, y: 0 };
      acc += dt;
      if (acc > 110) {
        acc = 0;
        dir = pending;
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        const hit =
          head.x < 0 ||
          head.y < 0 ||
          head.x >= cols ||
          head.y >= rows ||
          snake.some((part) => part.x === head.x && part.y === head.y);
        if (hit) {
          alive = false;
          setOver(true);
          return;
        }
        snake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
          setScore((value) => value + 1);
          placeFood();
        } else {
          snake.pop();
        }
      }
      const { w, h } = size.current;
      const cw = w / cols;
      const ch = h / rows;
      ctx.fillStyle = "#08111c";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#3ee0c4";
      ctx.fillRect(food.x * cw + 4, food.y * ch + 4, cw - 8, ch - 8);
      snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#e8eef8" : "#7aa0c2";
        ctx.fillRect(part.x * cw + 2, part.y * ch + 2, cw - 4, ch - 4);
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Crashed" : null}
      hint="Arrow keys"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function TapFlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let y = 0.45;
    let vy = 0;
    let xScroll = 0;
    const pipes: { x: number; gap: number }[] = [
      { x: 1.2, gap: 0.4 },
      { x: 1.85, gap: 0.55 },
    ];
    let last = performance.now();
    let alive = true;
    let passed = 0;
    const flap = () => {
      if (alive) vy = -0.013;
    };
    canvas.addEventListener("pointerdown", flap);
    const key = (event: KeyboardEvent) => {
      if (event.key === " ") flap();
    };
    window.addEventListener("keydown", key);

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { w, h } = size.current;
      vy += 0.00072 * dt;
      y += vy * dt;
      xScroll += 0.00038 * dt;
      for (const pipe of pipes) {
        pipe.x -= 0.00038 * dt * 2.4;
        if (pipe.x < -0.2) {
          pipe.x += 1.3;
          pipe.gap = rand(0.28, 0.7);
        }
      }
      const px = 0.28;
      const hitBound = y < 0.04 || y > 0.96;
      const hitPipe = pipes.some((pipe) => {
        const near = Math.abs(pipe.x - px) < 0.08;
        return near && Math.abs(y - pipe.gap) > 0.16;
      });
      for (const pipe of pipes) {
        if (pipe.x + 0.08 < px && pipe.x + 0.08 + 0.00038 * dt * 2.4 >= px) {
          passed += 1;
          setScore(passed);
        }
      }
      if (hitBound || hitPipe) {
        alive = false;
        setBest((value) => Math.max(value, passed));
        setOver(true);
        return;
      }
      ctx.fillStyle = "#102033";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#1d4a46";
      for (const pipe of pipes) {
        const gx = pipe.x * w;
        ctx.fillRect(gx - 28, 0, 56, pipe.gap * h - 70);
        ctx.fillRect(gx - 28, pipe.gap * h + 70, 56, h);
      }
      ctx.fillStyle = "#f0c14b";
      ctx.beginPath();
      ctx.arc(px * w, y * h, 14, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      canvas.removeEventListener("pointerdown", flap);
      window.removeEventListener("keydown", key);
    };
  }, [size, over]);

  return (
    <GameChrome
      score={score}
      best={best}
      message={over ? "Crashed" : null}
      hint="Tap / space to flap"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function BrickBash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState<string | null>(null);
  const run = useRef(0);
  const pointerX = useRef<number | null>(null);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(null);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let paddle = 0.5;
    let ball = { x: 0.5, y: 0.7, vx: 0.004, vy: -0.006 };
    const bricks: { x: number; y: number; live: boolean }[] = [];
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        bricks.push({ x: 0.08 + col * 0.115, y: 0.08 + row * 0.07, live: true });
      }
    }
    let last = performance.now();
    let alive = true;
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX.current = (event.clientX - rect.left) / rect.width;
    };
    canvas.addEventListener("pointermove", move);

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { w, h } = size.current;
      if (keys.current.has("ArrowLeft")) paddle -= 0.012 * dt;
      if (keys.current.has("ArrowRight")) paddle += 0.012 * dt;
      if (pointerX.current != null) paddle = pointerX.current;
      paddle = Math.max(0.1, Math.min(0.9, paddle));
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.x < 0.03 || ball.x > 0.97) ball.vx *= -1;
      if (ball.y < 0.04) ball.vy *= -1;
      if (ball.y > 0.9 && Math.abs(ball.x - paddle) < 0.12) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx = (ball.x - paddle) * 0.02;
      }
      for (const brick of bricks) {
        if (!brick.live) continue;
        if (
          Math.abs(ball.x - brick.x) < 0.055 &&
          Math.abs(ball.y - brick.y) < 0.035
        ) {
          brick.live = false;
          ball.vy *= -1;
          setScore((value) => value + 10);
        }
      }
      if (ball.y > 1.05) {
        alive = false;
        setOver("Missed the ball");
        return;
      }
      if (bricks.every((brick) => !brick.live)) {
        alive = false;
        setOver("Cleared the wall");
        return;
      }
      ctx.fillStyle = "#0b1524";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#d9b36a";
      for (const brick of bricks) {
        if (!brick.live) continue;
        ctx.fillRect(brick.x * w - 36, brick.y * h - 12, 72, 24);
      }
      ctx.fillStyle = "#e8eef8";
      ctx.fillRect(paddle * w - 60, h * 0.9, 120, 14);
      ctx.beginPath();
      ctx.arc(ball.x * w, ball.y * h, 8, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
      canvas.removeEventListener("pointermove", move);
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      message={over}
      hint="Move paddle with mouse or arrows"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function PongDuel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState("0 – 0");
  const [over, setOver] = useState<string | null>(null);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore("0 – 0");
    setOver(null);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let player = 0.5;
    let cpu = 0.5;
    let ball = { x: 0.5, y: 0.5, vx: 0.006, vy: 0.003 };
    let p = 0;
    let c = 0;
    let last = performance.now();
    let alive = true;
    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { w, h } = size.current;
      if (keys.current.has("ArrowUp") || keys.current.has("w")) player -= 0.01 * dt;
      if (keys.current.has("ArrowDown") || keys.current.has("s")) player += 0.01 * dt;
      player = Math.max(0.12, Math.min(0.88, player));
      cpu += (ball.y - cpu) * 0.08;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.y < 0.04 || ball.y > 0.96) ball.vy *= -1;
      if (ball.x < 0.08 && Math.abs(ball.y - player) < 0.12) ball.vx = Math.abs(ball.vx);
      if (ball.x > 0.92 && Math.abs(ball.y - cpu) < 0.12) ball.vx = -Math.abs(ball.vx);
      if (ball.x < 0) {
        c += 1;
        ball = { x: 0.5, y: 0.5, vx: 0.006, vy: 0.003 };
      }
      if (ball.x > 1) {
        p += 1;
        ball = { x: 0.5, y: 0.5, vx: -0.006, vy: 0.003 };
      }
      setScore(`${p} – ${c}`);
      if (p >= 5 || c >= 5) {
        alive = false;
        setOver(p > c ? "You win" : "CPU wins");
        return;
      }
      ctx.fillStyle = "#071018";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#334866";
      for (let y = 0; y < h; y += 24) ctx.fillRect(w / 2 - 2, y, 4, 14);
      ctx.fillStyle = "#e8eef8";
      ctx.fillRect(24, player * h - 48, 10, 96);
      ctx.fillRect(w - 34, cpu * h - 48, 10, 96);
      ctx.beginPath();
      ctx.arc(ball.x * w, ball.y * h, 8, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      message={over ?? score}
      hint="W / S or arrows · first to 5"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function DodgeFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);
  const pointerX = useRef<number | null>(null);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let x = 0.5;
    const drops: { x: number; y: number; r: number; s: number }[] = [];
    let last = performance.now();
    let alive = true;
    let t = 0;
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX.current = (event.clientX - rect.left) / rect.width;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", move);

    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      t += dt;
      const { w, h } = size.current;
      if (keys.current.has("ArrowLeft")) x -= 0.012 * dt;
      if (keys.current.has("ArrowRight")) x += 0.012 * dt;
      if (pointerX.current != null) x = pointerX.current;
      x = Math.max(0.06, Math.min(0.94, x));
      if (Math.random() < 0.08 + t / 40000) {
        drops.push({ x: rand(0.05, 0.95), y: -0.1, r: rand(10, 18), s: rand(0.004, 0.01) });
      }
      for (const drop of drops) drop.y += drop.s * dt;
      const hit = drops.some(
        (drop) => Math.hypot((drop.x - x) * w, (drop.y - 0.86) * h) < drop.r + 14,
      );
      if (hit) {
        alive = false;
        setOver(true);
        return;
      }
      setScore(Math.floor(t / 100));
      ctx.fillStyle = "#101826";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#d97b6a";
      for (const drop of drops) {
        ctx.beginPath();
        ctx.arc(drop.x * w, drop.y * h, drop.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#8fd3c8";
      ctx.beginPath();
      ctx.arc(x * w, h * 0.86, 16, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Hit" : null}
      hint="Move to dodge falling tiles"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function CatchStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let x = 0.5;
    const stars: { x: number; y: number; good: boolean }[] = [];
    let last = performance.now();
    let points = 0;
    let misses = 0;
    let alive = true;
    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      const { w, h } = size.current;
      if (keys.current.has("ArrowLeft")) x -= 0.012 * dt;
      if (keys.current.has("ArrowRight")) x += 0.012 * dt;
      x = Math.max(0.08, Math.min(0.92, x));
      if (Math.random() < 0.04) {
        stars.push({ x: rand(0.1, 0.9), y: -0.05, good: Math.random() > 0.22 });
      }
      for (const star of stars) star.y += 0.0045 * dt;
      for (const star of [...stars]) {
        if (star.y > 0.9 && Math.abs(star.x - x) < 0.1) {
          if (star.good) points += 1;
          else misses += 2;
          stars.splice(stars.indexOf(star), 1);
        } else if (star.y > 1.05) {
          if (star.good) misses += 1;
          stars.splice(stars.indexOf(star), 1);
        }
      }
      setScore(points);
      if (misses >= 5) {
        alive = false;
        setOver(true);
        return;
      }
      ctx.fillStyle = "#0a1020";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        ctx.fillStyle = star.good ? "#f4d27a" : "#c45c5c";
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#9ec4c8";
      ctx.fillRect(x * w - 36, h * 0.9, 72, 14);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Too many misses" : null}
      hint="Catch gold, avoid red"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function PlatformHop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let x = 0.5;
    let y = 0.7;
    let vy = 0;
    const pads: { x: number; y: number }[] = [
      { x: 0.5, y: 0.85 },
      { x: 0.3, y: 0.62 },
      { x: 0.7, y: 0.4 },
      { x: 0.45, y: 0.18 },
    ];
    let last = performance.now();
    let alive = true;
    let height = 0;
    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const { w, h } = size.current;
      if (keys.current.has("ArrowLeft")) x -= 0.014 * dt;
      if (keys.current.has("ArrowRight")) x += 0.014 * dt;
      if (x < 0) x = 1;
      if (x > 1) x = 0;
      vy += 0.45 * dt;
      y += vy * 0.01 * dt;
      if (vy > 0) {
        for (const pad of pads) {
          if (Math.abs(x - pad.x) < 0.11 && y > pad.y - 0.03 && y < pad.y + 0.02) {
            vy = -9.2;
            y = pad.y - 0.03;
          }
        }
      }
      if (y < 0.45) {
        const lift = 0.45 - y;
        y = 0.45;
        height += lift;
        for (const pad of pads) pad.y += lift;
      }
      for (const pad of pads) {
        if (pad.y > 1.1) {
          pad.y -= 1.2;
          pad.x = rand(0.15, 0.85);
        }
      }
      if (y > 1.15) {
        alive = false;
        setOver(true);
        return;
      }
      setScore(Math.floor(height * 80));
      ctx.fillStyle = "#0c1524";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#3ee0c4";
      for (const pad of pads) ctx.fillRect(pad.x * w - 42, pad.y * h, 84, 10);
      ctx.fillStyle = "#e8eef8";
      ctx.beginPath();
      ctx.arc(x * w, y * h, 12, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      alive = false;
    };
  }, [keys, size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Fell" : null}
      hint="Arrows to move · bounce up"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function TapTarget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    let target = { x: 0.5, y: 0.5, r: 0.08, born: performance.now() };
    let points = 0;
    let alive = true;
    const spawn = () => {
      target = {
        x: rand(0.15, 0.85),
        y: rand(0.2, 0.8),
        r: rand(0.05, 0.09),
        born: performance.now(),
      };
    };
    const click = (event: PointerEvent) => {
      if (!alive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (Math.hypot(x - target.x, y - target.y) < target.r) {
        points += 1;
        setScore(points);
        spawn();
      }
    };
    canvas.addEventListener("pointerdown", click);
    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      if (now - target.born > 1400) {
        alive = false;
        setOver(true);
        return;
      }
      const { w, h } = size.current;
      ctx.fillStyle = "#0b1524";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#e06b6b";
      ctx.beginPath();
      ctx.arc(target.x * w, target.y * h, target.r * Math.min(w, h), 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => canvas.removeEventListener("pointerdown", click);
  }, [size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Missed the target" : null}
      hint="Tap each circle before it vanishes"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function BalloonPop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    const balloons: { x: number; y: number; r: number; s: number; popped: boolean }[] = [];
    let last = performance.now();
    let escaped = 0;
    let points = 0;
    let alive = true;
    const click = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      for (const balloon of balloons) {
        if (!balloon.popped && Math.hypot(x - balloon.x, y - balloon.y) < balloon.r) {
          balloon.popped = true;
          points += 1;
          setScore(points);
        }
      }
    };
    canvas.addEventListener("pointerdown", click);
    const frame = (now: number) => {
      if (!alive || local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      if (Math.random() < 0.03) {
        balloons.push({
          x: rand(0.1, 0.9),
          y: 1.1,
          r: rand(0.04, 0.07),
          s: rand(0.0018, 0.0034),
          popped: false,
        });
      }
      for (const balloon of balloons) balloon.y -= balloon.s * dt;
      for (const balloon of balloons) {
        if (!balloon.popped && balloon.y < -0.1) {
          balloon.popped = true;
          escaped += 1;
        }
      }
      if (escaped >= 5) {
        alive = false;
        setOver(true);
        return;
      }
      const { w, h } = size.current;
      ctx.fillStyle = "#122033";
      ctx.fillRect(0, 0, w, h);
      for (const balloon of balloons) {
        if (balloon.popped) continue;
        ctx.fillStyle = "#e07aa0";
        ctx.beginPath();
        ctx.arc(balloon.x * w, balloon.y * h, balloon.r * Math.min(w, h), 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => canvas.removeEventListener("pointerdown", click);
  }, [size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Too many escaped" : null}
      hint="Pop balloons before they float away"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}

export function StackUp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(canvasRef);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const run = useRef(0);

  function restart() {
    run.current += 1;
    setScore(0);
    setOver(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const local = run.current;
    const stack = [{ x: 0.5, w: 0.42 }];
    let moving = { x: 0.2, w: 0.42, dir: 1, speed: 0.004 };
    let last = performance.now();
    let alive = true;
    const drop = () => {
      if (!alive) return;
      const top = stack[stack.length - 1];
      const left = Math.max(top.x - top.w / 2, moving.x - moving.w / 2);
      const right = Math.min(top.x + top.w / 2, moving.x + moving.w / 2);
      const w = right - left;
      if (w < 0.04) {
        alive = false;
        setOver(true);
        return;
      }
      stack.push({ x: (left + right) / 2, w });
      moving = {
        x: 0.15,
        w,
        dir: stack.length % 2 ? 1 : -1,
        speed: 0.004 + stack.length * 0.00025,
      };
      setScore(stack.length - 1);
    };
    canvas.addEventListener("pointerdown", drop);
    const key = (event: KeyboardEvent) => {
      if (event.key === " ") drop();
    };
    window.addEventListener("keydown", key);
    const frame = (now: number) => {
      if (local !== run.current) return;
      const dt = Math.min(32, now - last);
      last = now;
      if (alive) {
        moving.x += moving.dir * moving.speed * dt;
        if (moving.x > 0.88 || moving.x < 0.12) moving.dir *= -1;
      }
      const { w, h } = size.current;
      ctx.fillStyle = "#0b1524";
      ctx.fillRect(0, 0, w, h);
      const base = h * 0.88;
      stack.forEach((block, index) => {
        ctx.fillStyle = index % 2 ? "#3ee0c4" : "#7aa0c2";
        const y = base - index * 18;
        ctx.fillRect(block.x * w - (block.w * w) / 2, y, block.w * w, 16);
      });
      ctx.fillStyle = "#f4d27a";
      const y = base - stack.length * 18;
      ctx.fillRect(moving.x * w - (moving.w * w) / 2, y, moving.w * w, 16);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      canvas.removeEventListener("pointerdown", drop);
      window.removeEventListener("keydown", key);
    };
  }, [size, over]);

  return (
    <GameChrome
      score={score}
      message={over ? "Stack slipped" : null}
      hint="Tap / space to drop"
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </GameChrome>
  );
}
