export type PolytrackMap = {
  id: string;
  name: string;
  file: string;
  lite?: boolean;
};

/** Community import codes from https://github.com/TiniTheBagel/polytrack-import-codes */
export const POLYTRACK_MAPS: PolytrackMap[] = [
  {
    id: "amethyst-skyscraper",
    name: "Amethyst Skyscraper",
    file: "/notes/polytrack/amethyst-skyscraper.txt",
  },
  {
    id: "amethyst-skyscraper-lite",
    name: "Amethyst Skyscraper — Lite",
    file: "/notes/polytrack/amethyst-skyscraper-lite.txt",
    lite: true,
  },
  {
    id: "bismuth-mines",
    name: "Bismuth Mines",
    file: "/notes/polytrack/bismuth-mines.txt",
  },
  {
    id: "jade-mountain",
    name: "Jade Mountain",
    file: "/notes/polytrack/jade-mountain.txt",
  },
  {
    id: "opal-palace",
    name: "Opal Palace",
    file: "/notes/polytrack/opalpalace.txt",
  },
  {
    id: "opal-palace-repolished",
    name: "Opal Palace — Repolished",
    file: "/notes/polytrack/opal-palace-repolished.txt",
  },
  {
    id: "quartz-city",
    name: "Quartz City",
    file: "/notes/polytrack/quartz-city.txt",
  },
];
