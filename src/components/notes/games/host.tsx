"use client";

import type { ComponentType } from "react";
import {
  BalloonPop,
  BrickBash,
  ByteSnake,
  CatchStars,
  DodgeFall,
  NeonLoop,
  PlatformHop,
  PongDuel,
  SlopeRush,
  StickDash,
  StackUp,
  TapFlight,
  TapTarget,
} from "@/components/notes/games/arcade";
import {
  ColorMatch,
  DotConnect,
  MemoryMatch,
  Merge2048,
  MinesLite,
  NumberOrder,
  ReactionTest,
  SimonSays,
  SpeedMath,
  TicTacToe,
  WhackTile,
} from "@/components/notes/games/puzzles";

const GAMES: Record<string, ComponentType> = {
  "stick-dash": StickDash,
  "neon-loop": NeonLoop,
  "slope-rush": SlopeRush,
  "merge-2048": Merge2048,
  "byte-snake": ByteSnake,
  "tap-flight": TapFlight,
  "brick-bash": BrickBash,
  "pong-duel": PongDuel,
  "memory-match": MemoryMatch,
  "whack-tile": WhackTile,
  "dodge-fall": DodgeFall,
  "tap-target": TapTarget,
  "reaction-test": ReactionTest,
  "simon-says": SimonSays,
  "tic-tac-toe": TicTacToe,
  "speed-math": SpeedMath,
  "catch-stars": CatchStars,
  "number-order": NumberOrder,
  "platform-hop": PlatformHop,
  "minesweeper-lite": MinesLite,
  "color-match": ColorMatch,
  "balloon-pop": BalloonPop,
  "stack-up": StackUp,
  "dot-connect": DotConnect,
};

export function GameHost({ id }: { id: string }) {
  const Game = GAMES[id];
  if (!Game) {
    return (
      <div className="flex h-full items-center justify-center text-[#9aa8bd]">
        This topic is not available yet.
      </div>
    );
  }
  return <Game />;
}
