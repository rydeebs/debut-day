"use client";
import { useState } from "react";
import { LineupPlayer } from "@/data/players";
import { namesMatch } from "@/lib/gameUtils";

// Offense positions (x,y) in 500×200 viewBox
const OFF_POS: Record<string, [number, number]> = {
  QB:  [250, 150],
  RB:  [250, 185],
  WR1: [ 50, 120],
  WR2: [450, 120],
  TE:  [370, 110],
  LT:  [140, 100],
  LG:  [180, 100],
  C:   [220, 100],
  RG:  [260, 100],
  RT:  [300, 100],
};

// Defense positions in 500×200 viewBox
const DEF_POS: Record<string, [number, number]> = {
  DE1: [130, 85],
  DT1: [185, 85],
  DT2: [235, 85],
  DE2: [290, 85],
  OLB: [90,  55],
  MLB: [215, 55],
  ILB: [265, 55],
  CB1: [ 40, 30],
  CB2: [360, 30],
  FS:  [250, 18],
  SS:  [160, 18],
};

interface Props {
  lineup: LineupPlayer[];
  guesses: Record<string, string>;
  revealed: Record<string, boolean>;
  featuredPlayer: string;
  onGuess: (pos: string, val: string) => void;
  onReveal: (pos: string) => void;
}

function nodeColor(pos: string, guesses: Record<string, string>, revealed: Record<string, boolean>, lineup: LineupPlayer[], feat: string) {
  const lp = lineup.find((l) => l.position === pos);
  if (!lp) return "#374151";
  if (lp.player === feat) return "#d97706";
  if (revealed[pos]) return "#991b1b";
  if (guesses[pos] && namesMatch(guesses[pos], lp.player)) return "#166534";
  return "#1f2937";
}

function PositionNode({ pos, cx, cy, guesses, revealed, lineup, feat }: {
  pos: string; cx: number; cy: number;
  guesses: Record<string, string>; revealed: Record<string, boolean>;
  lineup: LineupPlayer[]; feat: string;
}) {
  const fill = nodeColor(pos, guesses, revealed, lineup, feat);
  const lp = lineup.find((l) => l.position === pos);
  const isCorrect = lp ? namesMatch(guesses[pos] ?? "", lp.player) : false;
  const isFeature = lp?.player === feat;
  return (
    <g>
      <circle cx={cx} cy={cy} r="18" fill={fill}
        stroke={isFeature ? "#f97316" : isCorrect ? "#22c55e" : "#4b5563"} strokeWidth="2" />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{pos}</text>
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#9ca3af" fontSize="5.5">
        {lp && (isFeature || isCorrect || revealed[pos]) ? lp.player.split(" ").pop()?.slice(0, 7) : "???"}
      </text>
    </g>
  );
}

function InputGrid({ positions, posMap, lineup, guesses, revealed, feat, onGuess, onReveal }: {
  positions: string[]; posMap: Record<string, [number, number]>;
  lineup: LineupPlayer[]; guesses: Record<string, string>;
  revealed: Record<string, boolean>; feat: string;
  onGuess: (p: string, v: string) => void; onReveal: (p: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {positions.filter((p) => posMap[p]).map((pos) => {
        const lp = lineup.find((l) => l.position === pos)!;
        if (!lp) return null;
        const isFeature = lp.player === feat;
        const isCorrect = namesMatch(guesses[pos] ?? "", lp.player);
        return (
          <div key={pos} className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-bold">{pos}</span>
            {isFeature ? (
              <div className="px-1.5 py-1 rounded bg-orange-900/30 border border-orange-700 text-orange-300 text-xs truncate">{lp.player} ★</div>
            ) : isCorrect ? (
              <div className="px-1.5 py-1 rounded bg-green-900/30 border border-green-700 text-green-300 text-xs truncate">✓ {lp.player}</div>
            ) : revealed[pos] ? (
              <div className="px-1.5 py-1 rounded bg-red-900/20 border border-red-800 text-red-400 text-xs truncate">{lp.player}</div>
            ) : (
              <div className="flex gap-0.5">
                <input
                  className="flex-1 min-w-0 px-1.5 py-1 bg-brand-dark border border-brand-border rounded text-white text-xs outline-none focus:ring-1 focus:ring-brand-accent/60"
                  placeholder="Name…"
                  value={guesses[pos] ?? ""}
                  onChange={(e) => onGuess(pos, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onGuess(pos, (e.target as HTMLInputElement).value)}
                />
                <button onClick={() => onReveal(pos)} className="px-1 text-xs border border-brand-border text-gray-500 rounded hover:text-red-400" title="-50">👁</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FootballField({ lineup, guesses, revealed, featuredPlayer, onGuess, onReveal }: Props) {
  const [view, setView] = useState<"offense" | "defense">("offense");
  const offensePositions = Object.keys(OFF_POS);
  const defensePositions = Object.keys(DEF_POS);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex gap-2 mb-3">
        {(["offense", "defense"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${view === v ? "bg-brand-accent text-white" : "bg-brand-dark border border-brand-border text-gray-400 hover:text-white"}`}>
            {v}
          </button>
        ))}
      </div>

      {view === "offense" && (
        <>
          <svg viewBox="0 0 500 200" className="w-full h-auto mb-3">
            <rect width="500" height="200" fill="#14532d" />
            {[50,100,150].map((y) => (
              <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="white" strokeWidth="0.5" strokeDasharray="8,8" opacity="0.3" />
            ))}
            <line x1="0" y1="100" x2="500" y2="100" stroke="white" strokeWidth="1" opacity="0.5" />
            {offensePositions.map((pos) => {
              const [cx, cy] = OFF_POS[pos];
              return <PositionNode key={pos} pos={pos} cx={cx} cy={cy} guesses={guesses} revealed={revealed} lineup={lineup} feat={featuredPlayer} />;
            })}
          </svg>
          <InputGrid positions={offensePositions} posMap={OFF_POS} lineup={lineup} guesses={guesses} revealed={revealed} feat={featuredPlayer} onGuess={onGuess} onReveal={onReveal} />
        </>
      )}

      {view === "defense" && (
        <>
          <svg viewBox="0 0 400 110" className="w-full h-auto mb-3">
            <rect width="400" height="110" fill="#14532d" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="1" opacity="0.4" />
            {defensePositions.map((pos) => {
              const coords = DEF_POS[pos];
              if (!coords) return null;
              return <PositionNode key={pos} pos={pos} cx={coords[0]} cy={coords[1]} guesses={guesses} revealed={revealed} lineup={lineup} feat={featuredPlayer} />;
            })}
          </svg>
          <InputGrid positions={defensePositions} posMap={DEF_POS} lineup={lineup} guesses={guesses} revealed={revealed} feat={featuredPlayer} onGuess={onGuess} onReveal={onReveal} />
        </>
      )}
    </div>
  );
}
