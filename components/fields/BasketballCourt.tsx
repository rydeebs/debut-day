"use client";
import { LineupPlayer } from "@/data/players";
import { namesMatch } from "@/lib/gameUtils";

const POSITIONS: Record<string, [number, number]> = {
  PG: [200, 270],
  SG: [330, 210],
  SF: [370, 100],
  PF: [280, 65],
  C:  [200, 65],
};

interface Props {
  lineup: LineupPlayer[];
  guesses: Record<string, string>;
  revealed: Record<string, boolean>;
  featuredPlayer: string;
  onGuess: (pos: string, val: string) => void;
  onReveal: (pos: string) => void;
}

function posColor(pos: string, guesses: Record<string, string>, revealed: Record<string, boolean>, lineup: LineupPlayer[], feat: string) {
  const lp = lineup.find((l) => l.position === pos);
  if (!lp) return "#374151";
  if (lp.player === feat) return "#d97706";
  if (revealed[pos]) return "#991b1b";
  if (guesses[pos] && namesMatch(guesses[pos], lp.player)) return "#166534";
  return "#1f2937";
}

export default function BasketballCourt({ lineup, guesses, revealed, featuredPlayer, onGuess, onReveal }: Props) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 400 320" className="w-full h-auto" aria-label="Basketball half-court">
        {/* Court */}
        <rect width="400" height="320" fill="#92400e" rx="4" />
        <rect x="10" y="10" width="380" height="300" fill="none" stroke="white" strokeWidth="2" rx="2" />
        {/* Key / Paint */}
        <rect x="130" y="10" width="140" height="160" fill="#78350f" stroke="white" strokeWidth="2" />
        {/* Free throw circle */}
        <circle cx="200" cy="170" r="60" fill="none" stroke="white" strokeWidth="2" />
        {/* Basket */}
        <circle cx="200" cy="30" r="12" fill="none" stroke="#ef4444" strokeWidth="3" />
        <line x1="200" y1="10" x2="200" y2="42" stroke="#ef4444" strokeWidth="2" />
        {/* Three point arc */}
        <path d="M 40,10 Q 40,240 200,240 Q 360,240 360,10" fill="none" stroke="white" strokeWidth="2" />

        {lineup.map((lp) => {
          const coords = POSITIONS[lp.position];
          if (!coords) return null;
          const [cx, cy] = coords;
          const fill = posColor(lp.position, guesses, revealed, lineup, featuredPlayer);
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          const isFeature = lp.player === featuredPlayer;
          return (
            <g key={lp.position}>
              <circle cx={cx} cy={cy} r="24" fill={fill}
                stroke={isFeature ? "#f97316" : isCorrect ? "#22c55e" : "#4b5563"} strokeWidth="2" />
              <text x={cx} y={cy - 7} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{lp.position}</text>
              <text x={cx} y={cy + 7} textAnchor="middle" fill="#9ca3af" fontSize="7">
                {isFeature || isCorrect || revealed[lp.position]
                  ? lp.player.split(" ").pop()?.slice(0, 8)
                  : "???"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {lineup.map((lp) => {
          const isFeature = lp.player === featuredPlayer;
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          return (
            <div key={lp.position} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold">{lp.position}</span>
              {isFeature ? (
                <div className="px-2 py-1.5 rounded bg-orange-900/30 border border-orange-700 text-orange-300 text-xs font-semibold">{lp.player} ★</div>
              ) : isCorrect ? (
                <div className="px-2 py-1.5 rounded bg-green-900/30 border border-green-700 text-green-300 text-xs">✓ {lp.player}</div>
              ) : revealed[lp.position] ? (
                <div className="px-2 py-1.5 rounded bg-red-900/20 border border-red-800 text-red-400 text-xs">{lp.player}</div>
              ) : (
                <div className="flex gap-1">
                  <input
                    className="flex-1 px-2 py-1 bg-brand-dark border border-brand-border rounded text-white text-xs outline-none focus:ring-1 focus:ring-brand-accent/60"
                    placeholder="Player name…"
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
