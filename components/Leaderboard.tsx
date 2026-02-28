"use client";
import { useEffect, useState } from "react";
import { getHighScores, HighScores } from "@/lib/gameUtils";
import { Sport } from "@/data/players";

const SPORT_ICONS: Record<Sport, string> = {
  baseball:   "⚾",
  basketball: "🏀",
  football:   "🏈",
  hockey:     "🏒",
  soccer:     "⚽",
};

export default function Leaderboard() {
  const [scores, setScores] = useState<HighScores | null>(null);

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  if (!scores) return null;

  const sports: Sport[] = ["baseball", "basketball", "football", "hockey", "soccer"];

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-5">
      <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
        🏆 Personal Best Scores
      </h3>
      <div className="space-y-2">
        {sports.map((sport) => (
          <div key={sport} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
            <span className="text-gray-300 text-sm capitalize">
              {SPORT_ICONS[sport]} {sport}
            </span>
            <span className={`font-bold text-sm ${scores[sport] > 0 ? "text-brand-accent" : "text-gray-600"}`}>
              {scores[sport] > 0 ? `${scores[sport].toLocaleString()} pts` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
