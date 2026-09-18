export type ClassNote = {
  id: string;
  subject: "Math" | "Science" | "History" | "English" | "CS";
  title: string;
  week: string;
  summary: string;
  body: string[];
};

export const CLASS_SUBJECTS = [
  "All",
  "Math",
  "Science",
  "History",
  "English",
  "CS",
] as const;

export const CLASS_NOTES: ClassNote[] = [
  {
    id: "linear-equations",
    subject: "Math",
    title: "Linear Equations — Slope & Intercept",
    week: "Week 3",
    summary: "Slope-intercept form, graphing lines, and checking solutions.",
    body: [
      "A linear equation graphs as a straight line. Slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept.",
      "Slope is rise over run: m = (y2 − y1) / (x2 − x1). A positive slope rises left to right; a negative slope falls.",
      "To graph, plot b on the y-axis, then use the slope to find a second point. Check by substituting a point back into the equation.",
      "Parallel lines share a slope. Perpendicular lines have slopes that are negative reciprocals (m and −1/m).",
    ],
  },
  {
    id: "quadratics",
    subject: "Math",
    title: "Quadratics — Factoring Overview",
    week: "Week 5",
    summary: "Standard form, zeros, and factoring trinomials.",
    body: [
      "A quadratic looks like ax² + bx + c. The graph is a parabola that opens up if a > 0 and down if a < 0.",
      "Factoring turns the expression into (px + q)(rx + s). The zeros are the x-values that make each factor 0.",
      "If the numbers do not factor cleanly, use the quadratic formula: x = (−b ± √(b² − 4ac)) / 2a.",
      "The discriminant b² − 4ac tells you the number of real roots: positive means two, zero means one, negative means none.",
    ],
  },
  {
    id: "cell-structure",
    subject: "Science",
    title: "Cell Structure — Organelles Map",
    week: "Week 2",
    summary: "Nucleus, membrane, mitochondria, and plant vs animal cells.",
    body: [
      "The cell membrane controls what enters and leaves. Cytoplasm is the fluid where organelles sit.",
      "The nucleus stores DNA and directs protein-making. Ribosomes build proteins; the ER and Golgi package and ship them.",
      "Mitochondria release energy from food (cellular respiration). Chloroplasts in plant cells capture light for photosynthesis.",
      "Plant cells also have a cell wall and a large vacuole. Animal cells do not.",
    ],
  },
  {
    id: "photosynthesis",
    subject: "Science",
    title: "Energy Transfer — Photosynthesis Notes",
    week: "Week 4",
    summary: "Light energy, glucose, and the flow of energy in ecosystems.",
    body: [
      "Photosynthesis: carbon dioxide + water + light → glucose + oxygen. It happens in chloroplasts.",
      "The light-dependent reactions split water and store energy in ATP and NADPH. The Calvin cycle uses that energy to build sugar.",
      "Respiration is the reverse idea: cells break sugar to make ATP. Producers capture energy; consumers eat to get it.",
      "Food webs show energy moving from the sun → producers → consumers → decomposers, with energy lost as heat at each step.",
    ],
  },
  {
    id: "industrial-revolution",
    subject: "History",
    title: "Industrial Revolution — Causes Timeline",
    week: "Week 6",
    summary: "Why industry took off, and what changed for workers and cities.",
    body: [
      "Britain industrialized first because of coal, iron, capital, colonies, and new machines such as the spinning jenny and steam engine.",
      "Factories pulled people into cities. Production rose, but hours were long and child labor was common at first.",
      "Railroads and steamships moved goods and people faster, tying regions into a bigger market.",
      "Reform laws later limited child labor, improved safety, and expanded voting as workers organized.",
    ],
  },
  {
    id: "civil-rights",
    subject: "History",
    title: "Civil Rights Movement — Landmark Cases",
    week: "Week 8",
    summary: "Court cases and campaigns that challenged segregation.",
    body: [
      "Plessy v. Ferguson (1896) allowed 'separate but equal.' Brown v. Board of Education (1954) rejected that for public schools.",
      "The Montgomery Bus Boycott, sit-ins, and Freedom Rides used nonviolent protest to challenge Jim Crow rules.",
      "The Civil Rights Act of 1964 banned segregation in public places and job discrimination. The Voting Rights Act of 1965 protected the ballot.",
      "Leaders included many local organizers as well as national figures. Court rulings and street campaigns worked together.",
    ],
  },
  {
    id: "essay-structure",
    subject: "English",
    title: "Essay Structure — Thesis & Evidence",
    week: "Week 1",
    summary: "Claim, reasons, proof, and a clean conclusion.",
    body: [
      "A thesis is one clear claim the rest of the essay will prove. Avoid a topic-only sentence; take a position.",
      "Each body paragraph needs a topic sentence, evidence (quote or fact), and a sentence that explains how the evidence supports the claim.",
      "Cite sources in the format your teacher asked for. Introduce quotes; do not drop them in alone.",
      "The conclusion should not copy the intro. Restate the claim in a new way and say why it matters.",
    ],
  },
  {
    id: "poetry-devices",
    subject: "English",
    title: "Poetry Devices — Quick Reference",
    week: "Week 7",
    summary: "Imagery, metaphor, sound, and how to write about them.",
    body: [
      "Imagery is language that appeals to the senses. Metaphor says one thing is another; simile uses like or as.",
      "Alliteration repeats starting sounds. Assonance repeats vowel sounds. Onomatopoeia imitates a sound.",
      "Personification gives human traits to non-human things. Hyperbole exaggerates on purpose.",
      "When you analyze a poem, name the device, quote it, and explain the effect on tone or meaning.",
    ],
  },
  {
    id: "loops-arrays",
    subject: "CS",
    title: "Programming Basics — Loops & Arrays",
    week: "Week 3",
    summary: "Repeating work, storing lists, and common off-by-one mistakes.",
    body: [
      "An array (or list) stores values in order. Indexing usually starts at 0, so the last item is length − 1.",
      "A for loop is good when you know how many times to repeat. A while loop repeats until a condition is false.",
      "Off-by-one errors happen when you use < vs ≤, or forget that the last index is length − 1.",
      "Trace a loop on paper with a tiny list. If you can predict each step, the code is easier to debug.",
    ],
  },
  {
    id: "html-css",
    subject: "CS",
    title: "Web Notes — HTML & CSS Essentials",
    week: "Week 5",
    summary: "Page structure, selectors, and box model.",
    body: [
      "HTML describes structure: headings, paragraphs, links, lists, and landmarks such as header and main.",
      "CSS selects elements and sets color, type, spacing, and layout. Classes are reusable; ids should be unique.",
      "The box model is content + padding + border + margin. Width can include or exclude padding depending on box-sizing.",
      "Use semantic tags and alt text so pages work for screen readers and keyboards, not only for the mouse.",
    ],
  },
];

export function getClassNote(id: string) {
  return CLASS_NOTES.find((note) => note.id === id) ?? null;
}
