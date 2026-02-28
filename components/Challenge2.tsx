"use client";
import { useState } from "react";
import { PlayerData } from "@/data/players";
import { namesMatch, pointsForTier, POINTS } from "@/lib/gameUtils";
import BaseballDiamond from "./fields/BaseballDiamond";
import BasketballCourt from "./fields/BasketballCourt";
import FootballField from "./fields/FootballField";
import HockeyRink from "./fields/HockeyRink";
import SoccerPitch from "./fields/SoccerPitch";

interface Props {
  player: PlayerData;
  onComplete: (score: number, correctMap: Record<string, boolean>) => void;
}

export default function Challenge2({ player, onComplete }: Props) {
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const nonFeaturedLineup = player.debutLineup.filter(
    (lp) => lp.player !== player.player,
  );

  function handleGuess(pos: string, val: string) {
    setGuesses((prev) => ({ ...prev, [pos]: val }));

    const lp = nonFeaturedLineup.find((l) => l.position === pos);
    if (!lp) return;
    if (namesMatch(val, lp.player) && !confirmed[pos]) {
      setConfirmed((prev) => ({ ...prev, [pos]: true }));
      setScore((s) => s + pointsForTier(lp.obscurityTier));
    }
  }

  function handleReveal(pos: string) {
    if (revealed[pos] || confirmed[pos]) return;
    setRevealed((prev) => ({ ...prev, [pos]: true }));
    setScore((s) => Math.max(0, s + POINTS.reveal));
  }

  function handleSubmit() {
    setSubmitted(true);
    const correctMap: Record<string, boolean> = {};
    for (const lp of nonFeaturedLineup) {
      correctMap[lp.position] = !!confirmed[lp.position];
    }
    onComplete(score, correctMap);
  }

  const correctCount = Object.values(confirmed).filter(Boolean).length;
  const totalGuessable = nonFeaturedLineup.length;

  const FieldMap = {
    baseball:   BaseballDiamond,
    basketball: BasketballCourt,
    football:   FootballField,
    hockey:     HockeyRink,
    soccer:     SoccerPitch,
  }[player.sport];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-brand-card border border-brand-border rounded-xl p-5">
        <h2 className="text-brand-accent font-bold text-lg mb-1">
          Challenge 2 · Debut Lineup
        </h2>
        <p className="text-gray-400 text-sm">
          Name the players who started alongside{" "}
          <span className="text-white font-semibold">{player.player}</span> on{" "}
          <span className="text-white font-semibold">{player.debutDate}</span>.
          The featured player's position is highlighted in{" "}
          <span className="text-orange-400">orange</span>.
        </p>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>⭐ Star player = +{POINTS.star} pts</span>
          <span>👤 Role player = +{POINTS.average} pts</span>
          <span>❓ Obscure = +{POINTS.obscure} pts</span>
        </div>
      </div>

      <FieldMap
        lineup={player.debutLineup}
        guesses={guesses}
        revealed={revealed}
        featuredPlayer={player.player}
        onGuess={handleGuess}
        onReveal={handleReveal}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {correctCount}/{totalGuessable} correct ·{" "}
          <span className="text-white font-bold">{score} pts</span>
        </div>
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg font-semibold transition"
          >
            Submit & Continue →
          </button>
        )}
      </div>

      {submitted && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-green-300 text-sm">
          Challenge 2 complete! You got{" "}
          <strong>{correctCount}/{totalGuessable}</strong> teammates for{" "}
          <strong>{score} pts</strong>. Challenge 3 unlocked ↓
        </div>
      )}
    </div>
  );
}
