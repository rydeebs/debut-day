"use client";
import { useState } from "react";
import { PlayerData } from "@/data/players";
import { jerseyScore, POINTS } from "@/lib/gameUtils";

interface Props {
  player: PlayerData;
  onComplete: (score: number) => void;
}

export default function Challenge3({ player, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [guess, setGuess] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const num = parseInt(input.trim(), 10);
    if (isNaN(num) || num < 0 || num > 99) return;
    const pts = jerseyScore(num, player.debutNumber);
    setGuess(num);
    setScore(pts);
    setSubmitted(true);
    onComplete(pts);
  }

  const diff = guess !== null ? Math.abs(guess - player.debutNumber) : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-brand-card border border-brand-border rounded-xl p-5">
        <h2 className="text-brand-accent font-bold text-lg mb-1">
          Challenge 3 · What Number Did They Wear?
        </h2>
        <p className="text-gray-400 text-sm">
          What jersey number did{" "}
          <span className="text-white font-semibold">{player.player}</span> wear on debut day?
          {player.debutNumber !== player.iconicNumber && (
            <span className="block mt-1 text-yellow-500/80 italic">
              Hint: It may not be the number they're famous for (#
              {player.iconicNumber}).
            </span>
          )}
        </p>
      </div>

      {/* Big jersey display */}
      <div className="flex justify-center">
        <div
          className={`relative w-32 h-36 rounded-xl flex items-center justify-center text-5xl font-black border-2 transition-all duration-500 ${
            submitted
              ? score === POINTS.jerseyExact
                ? "bg-green-900/40 border-green-500 text-green-300"
                : score === POINTS.jerseyClose
                ? "bg-yellow-900/30 border-yellow-600 text-yellow-300"
                : "bg-red-900/30 border-red-700 text-red-300"
              : "bg-brand-dark border-brand-border text-white"
          }`}
        >
          {submitted ? `#${player.debutNumber}` : guess !== null ? `#${guess}` : "?"}
        </div>
      </div>

      {!submitted ? (
        <div className="flex gap-2 max-w-xs mx-auto">
          <input
            type="number"
            min={0}
            max={99}
            className="flex-1 bg-brand-dark border border-brand-border rounded-lg px-4 py-2 text-white text-center text-xl font-bold placeholder-gray-600 outline-none focus:ring-2 focus:ring-brand-accent/50"
            placeholder="#"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-5 py-2 bg-brand-accent text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-40 transition"
          >
            Lock In
          </button>
        </div>
      ) : (
        <div className="space-y-3 text-center animate-fade-in">
          <div
            className={`text-2xl font-black ${
              score === POINTS.jerseyExact
                ? "text-green-400"
                : score === POINTS.jerseyClose
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {score === POINTS.jerseyExact && "🎯 Exact! +500 pts"}
            {score === POINTS.jerseyClose && `📏 Close! (±${diff}) +100 pts`}
            {score === 0 && `❌ It was #${player.debutNumber} — your guess: #${guess}`}
          </div>

          {player.debutNumber !== player.iconicNumber && (
            <p className="text-gray-400 text-sm">
              Fun fact: {player.player} is famous for wearing #
              {player.iconicNumber}, but wore #{player.debutNumber} on debut day!
            </p>
          )}

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-green-300 text-sm">
            All 3 challenges complete! 🎉 See your final score below.
          </div>
        </div>
      )}

      {/* Scoring guide */}
      {!submitted && (
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>Exact → +500 pts</span>
          <span>Within 5 → +100 pts</span>
          <span>Off by more → 0 pts</span>
        </div>
      )}
    </div>
  );
}
