import { PLAYERS } from "@/data/players";

export interface PlayerSuggestion {
  name: string;
  year: string;
}

// Build a flat list of every guessable name across all player data.
// Deduplicates by name (keeps earliest year).
export const PLAYER_POOL: PlayerSuggestion[] = (() => {
  const map = new Map<string, string>();
  for (const p of PLAYERS) {
    const year = p.debutDate.slice(0, 4);
    for (const lp of p.debutLineup) {
      if (!map.has(lp.player)) map.set(lp.player, year);
    }
    for (const pred of p.predecessors) {
      if (!map.has(pred.name)) map.set(pred.name, year);
    }
  }
  return Array.from(map.entries())
    .map(([name, year]) => ({ name, year }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();
