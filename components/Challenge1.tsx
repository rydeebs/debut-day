"use client";
import { useState } from "react";
import { PlayerData } from "@/data/players";
import { namesMatch, POINTS } from "@/lib/gameUtils";

interface Props {
  player: PlayerData;
  onComplete: (score: number) => void;
}

export default function Challenge1({ player, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [guessed, setGuessed] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const primaryPred = player.predecessors.find((p) => p.primary);
  const secondaryPreds = player.predecessors.filter((p) => !p.primary);
  const allFound = player.predecessors.every((p) =>
    guessed.some((g) => namesMatch(g, p.name)),
  );

  function tryGuess() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const match = player.predecessors.find(
      (p) => namesMatch(trimmed, p.name) && !guessed.some((g) => namesMatch(g, p.name)),
    );

    if (match) {
      const pts = match.primary ? POINTS.predecessorPrimary : POINTS.predecessorSecondary;
      setScore((s) => s + pts);
      setGuessed((prev) => [...prev, match.name]);
      setFlash("correct");
    } else {
      setFlash("wrong");
    }

    setInput("");
    setTimeout(() => setFlash(null), 600);
  }

  function handleReveal() {
    const penalty = player.predecessors.filter(
      (p) => !guessed.some((g) => namesMatch(g, p.name)),
    ).length * POINTS.reveal;
    setScore((s) => Math.max(0, s + penalty));
    setRevealed(true);
  }

  function handleSubmit() {
    setSubmitted(true);
    onComplete(score);
  }

  const alreadyGuessed = (name: string) => guessed.some((g) => namesMatch(g, name));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-brand-card border border-brand-border rounded-xl p-5">
        <h2 className="text-brand-accent font-bold text-lg mb-1">
          Challenge 1 · Who Did They Replace?
        </h2>
        <p className="text-gray-400 text-sm">
          Before <span className="text-white font-semibold">{player.player}</span> took over the{" "}
          <span className="text-white font-semibold">{player.position}</span> spot for the{" "}
          <span className="text-white font-semibold">{player.team}</span>, who held the position?
          Name as many as you can.
        </p>
      </div>

      {/* Predecessor slots */}
      <div className="flex flex-wrap gap-2">
        {player.predecessors.map((pred) => (
          <div
            key={pred.name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              alreadyGuessed(pred.name) || revealed
                ? alreadyGuessed(pred.name)
                  ? "bg-green-900/40 border-green-600 text-green-300"
                  : "bg-red-900/30 border-red-700 text-red-300"
                : "bg-brand-dark border-brand-border text-gray-500"
            }`}
          >
            {pred.primary && <span className="text-yellow-400">★</span>}
            {alreadyGuessed(pred.name) || revealed ? pred.name : "???"}
            {pred.primary && (
              <span className="text-xs text-gray-500 ml-1">(+{POINTS.predecessorPrimary})</span>
            )}
            {!pred.primary && (
              <span className="text-xs text-gray-500 ml-1">(+{POINTS.predecessorSecondary})</span>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="flex gap-2">
          <input
            className={`flex-1 bg-brand-dark border rounded-lg px-4 py-2 text-white placeholder-gray-600 outline-none focus:ring-2 transition-all ${
              flash === "correct"
                ? "border-green-500 ring-2 ring-green-500/40"
                : flash === "wrong"
                ? "border-red-500 ring-2 ring-red-500/40"
                : "border-brand-border focus:ring-brand-accent/50"
            }`}
            placeholder="Type a player's name…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryGuess()}
            disabled={revealed || allFound}
          />
          <button
            onClick={tryGuess}
            disabled={revealed || allFound || !input.trim()}
            className="px-4 py-2 bg-brand-accent text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-40 transition"
          >
            Guess
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Score so far:{" "}
          <span className="text-white font-bold">{score} pts</span>
          {guessed.length > 0 && (
            <span className="ml-2 text-green-400">
              ✓ {guessed.length}/{player.predecessors.length} found
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {!revealed && !submitted && (
            <button
              onClick={handleReveal}
              className="px-3 py-1.5 text-xs border border-brand-border text-gray-400 rounded-lg hover:border-red-600 hover:text-red-400 transition"
            >
              Reveal All (−50 each)
            </button>
          )}
          {!submitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg font-semibold transition"
            >
              Submit & Continue →
            </button>
          )}
        </div>
      </div>

      {submitted && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-green-300 text-sm">
          Challenge 1 complete! You scored <strong>{score} pts</strong>. Challenge 2 unlocked ↓
        </div>
      )}
    </div>
  );
}
