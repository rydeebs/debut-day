"use client";
import { LineupPlayer } from "@/data/players";
import { namesMatch } from "@/lib/gameUtils";

const POSITIONS: Record<string, [number, number]> = {
  LW: [110, 120],
  C:  [200, 120],
  RW: [290, 120],
  LD: [145, 200],
  RD: [255, 200],
  G:  [200, 270],
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

export default function HockeyRink({ lineup, guesses, revealed, featuredPlayer, onGuess, onReveal }: Props) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 400 320" className="w-full h-auto">
        {/* Rink */}
        <rect x="10" y="10" width="380" height="300" rx="50" fill="#dbeafe" stroke="#1e40af" strokeWidth="3" />
        {/* Goal crease */}
        <ellipse cx="200" cy="280" rx="35" ry="20" fill="#bfdbfe" stroke="#ef4444" strokeWidth="2" />
        {/* Goal */}
        <rect x="183" y="290" width="34" height="14" fill="none" stroke="#ef4444" strokeWidth="2" rx="2" />
        {/* Red line */}
        <line x1="10" y1="180" x2="390" y2="180" stroke="#ef4444" strokeWidth="3" />
        {/* Blue line */}
        <line x1="10" y1="100" x2="390" y2="100" stroke="#1d4ed8" strokeWidth="2" />
        {/* Face-off circles */}
        <circle cx="130" cy="145" r="25" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="270" cy="145" r="25" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="200" cy="145" r="6" fill="#ef4444" />

        {lineup.map((lp) => {
          const coords = POSITIONS[lp.position];
          if (!coords) return null;
          const [cx, cy] = coords;
          const fill = nodeColor(lp.position, guesses, revealed, lineup, featuredPlayer);
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          const isFeature = lp.player === featuredPlayer;
          const radius = lp.position === "G" ? 26 : 22;
          return (
            <g key={lp.position}>
              <circle cx={cx} cy={cy} r={radius} fill={fill}
                stroke={isFeature ? "#f97316" : isCorrect ? "#22c55e" : "#6b7280"} strokeWidth="2.5" />
              <text x={cx} y={cy - 7} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{lp.position}</text>
              <text x={cx} y={cy + 7} textAnchor="middle" fill="#d1d5db" fontSize="7">
                {isFeature || isCorrect || revealed[lp.position]
                  ? lp.player.split(" ").pop()?.slice(0, 9)
                  : "???"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {lineup.map((lp) => {
          const isFeature = lp.player === featuredPlayer;
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          return (
            <div key={lp.position} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold">{lp.position}</span>
              {isFeature ? (
                <div className="px-2 py-1.5 rounded bg-orange-900/30 border border-orange-700 text-orange-300 text-xs">{lp.player} ★</div>
              ) : isCorrect ? (
                <div className="px-2 py-1.5 rounded bg-green-900/30 border border-green-700 text-green-300 text-xs">✓ {lp.player}</div>
              ) : revealed[lp.position] ? (
                <div className="px-2 py-1.5 rounded bg-red-900/20 border border-red-800 text-red-400 text-xs">{lp.player}</div>
              ) : (
                <div className="flex gap-1">
                  <input
                    className="flex-1 min-w-0 px-2 py-1 bg-brand-dark border border-brand-border rounded text-white text-xs outline-none focus:ring-1 focus:ring-brand-accent/60"
                    placeholder="Name…"
                    value={guesses[lp.position] ?? ""}
                    onChange={(e) => onGuess(lp.position, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onGuess(lp.position, (e.target as HTMLInputElement).value)}
                  />
                  <button onClick={() => onReveal(lp.position)} className="px-1.5 py-1 text-xs border border-brand-border text-gray-500 rounded hover:text-red-400 hover:border-red-700 transition" title="-50">👁</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
