export type PracticeTopic = {
  id: string;
  name: string;
  tag: string;
};

export const PRACTICE_TOPICS: PracticeTopic[] = [
  { id: "stick-dash", name: "Stick Dash", tag: "quick review" },
  { id: "neon-loop", name: "Neon Loop", tag: "quick review" },
  { id: "slope-rush", name: "Slope Rush", tag: "quick review" },
  { id: "merge-2048", name: "Merge 2048", tag: "quick review" },
  { id: "byte-snake", name: "Byte Snake", tag: "quick review" },
  { id: "tap-flight", name: "Tap Flight", tag: "quick review" },
  { id: "brick-bash", name: "Brick Bash", tag: "quick review" },
  { id: "pong-duel", name: "Pong Duel", tag: "quick review" },
  { id: "memory-match", name: "Memory Match", tag: "quick review" },
  { id: "whack-tile", name: "Whack Tile", tag: "quick review" },
  { id: "dodge-fall", name: "Dodge Fall", tag: "quick review" },
  { id: "tap-target", name: "Tap Target", tag: "quick review" },
  { id: "reaction-test", name: "Reaction Test", tag: "quick review" },
  { id: "simon-says", name: "Simon Says", tag: "quick review" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", tag: "quick review" },
  { id: "speed-math", name: "Speed Math", tag: "quick review" },
  { id: "catch-stars", name: "Catch Stars", tag: "quick review" },
  { id: "number-order", name: "Number Order", tag: "quick review" },
  { id: "platform-hop", name: "Platform Hop", tag: "quick review" },
  { id: "minesweeper-lite", name: "Mines Lite", tag: "quick review" },
  { id: "color-match", name: "Color Match", tag: "quick review" },
  { id: "balloon-pop", name: "Balloon Pop", tag: "quick review" },
  { id: "stack-up", name: "Stack Up", tag: "quick review" },
  { id: "dot-connect", name: "Dot Connect", tag: "quick review" },
];

export function getPracticeTopic(id: string) {
  return PRACTICE_TOPICS.find((topic) => topic.id === id) ?? null;
}
