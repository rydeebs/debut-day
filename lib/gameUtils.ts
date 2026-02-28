import { PlayerData, Sport, ObscurityTier, PLAYERS_BY_SPORT } from "@/data/players";

// ── Daily puzzle selection (date-seeded) ─────────────────────────────────────
export function getDailyPlayer(sport: Sport): PlayerData {
  const pool = PLAYERS_BY_SPORT[sport];
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return pool[seed % pool.length];
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ── Scoring ───────────────────────────────────────────────────────────────────
export const POINTS = {
  predecessorPrimary: 300,
  predecessorSecondary: 100,
  jerseyExact: 500,
  jerseyClose: 100,  // within 5
  star: 50,
  average: 150,
  obscure: 300,
  reveal: -50,
  completionBonus: 250,
} as const;

export function pointsForTier(tier: ObscurityTier): number {
  return POINTS[tier];
}

export function jerseyScore(guess: number, actual: number): number {
  if (guess === actual) return POINTS.jerseyExact;
  if (Math.abs(guess - actual) <= 5) return POINTS.jerseyClose;
  return 0;
}

// ── Fuzzy name matching ───────────────────────────────────────────────────────
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function namesMatch(guess: string, answer: string): boolean {
  const g = normalize(guess);
  const a = normalize(answer);
  if (g === a) return true;
  // last-name-only match
  const aLast = a.split(" ").pop() ?? "";
  if (g === aLast && aLast.length > 3) return true;
  // contains check
  if (a.includes(g) && g.length > 3) return true;
  return false;
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_SCORES_KEY = "debutday_highscores";
const LS_DAILY_KEY  = "debutday_daily";

export interface HighScores {
  baseball:   number;
  basketball: number;
  football:   number;
  hockey:     number;
  soccer:     number;
}

export function getHighScores(): HighScores {
  if (typeof window === "undefined") return emptyScores();
  try {
    return JSON.parse(localStorage.getItem(LS_SCORES_KEY) ?? "{}") as HighScores;
  } catch {
    return emptyScores();
  }
}

function emptyScores(): HighScores {
  return { baseball: 0, basketball: 0, football: 0, hockey: 0, soccer: 0 };
}

export function saveHighScore(sport: Sport, score: number): void {
  if (typeof window === "undefined") return;
  const scores = getHighScores();
  if (score > (scores[sport] ?? 0)) {
    scores[sport] = score;
    localStorage.setItem(LS_SCORES_KEY, JSON.stringify(scores));
  }
}

export interface DailyRecord {
  date: string;
  sport: Sport;
  playerId: string;
  score: number;
  completed: boolean;
}

export function getDailyRecord(sport: Sport): DailyRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${LS_DAILY_KEY}_${sport}_${todayKey()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDailyRecord(record: DailyRecord): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${LS_DAILY_KEY}_${record.sport}_${todayKey()}`,
    JSON.stringify(record),
  );
}

// ── Share text generation ─────────────────────────────────────────────────────
export function buildShareText(
  player: PlayerData,
  c1Score: number,
  c2Guesses: Record<string, boolean>,
  c3Score: number,
  total: number,
): string {
  const correctCount = Object.values(c2Guesses).filter(Boolean).length;
  const totalPositions = Object.keys(c2Guesses).length;

  const c1Emoji = c1Score >= 300 ? "🟩" : c1Score > 0 ? "🟨" : "🟥";
  const c2Emoji = Array.from({ length: totalPositions }, (_, i) =>
    Object.values(c2Guesses)[i] ? "🟩" : "⬛",
  ).join("");
  const c3Emoji = c3Score >= 500 ? "🟩" : c3Score > 0 ? "🟨" : "🟥";

  return [
    `🏟️ Debut Day — ${player.player}`,
    `${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    ``,
    `Challenge 1 (Predecessor): ${c1Emoji}`,
    `Challenge 2 (Lineup ${correctCount}/${totalPositions}): ${c2Emoji}`,
    `Challenge 3 (Jersey #):   ${c3Emoji}`,
    ``,
    `Total: ${total} pts`,
    `Play at: debut-day.vercel.app`,
  ].join("\n");
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
