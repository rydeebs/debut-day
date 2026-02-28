"use client";
import { LineupPlayer } from "@/data/players";
import { namesMatch } from "@/lib/gameUtils";

// position label → [cx, cy] in a 400×380 viewBox
const POSITIONS: Record<string, [number, number]> = {
  P:   [200, 210],
  C:   [200, 345],
  "1B":[330, 220],
  "2B":[270, 140],
  "3B": [70, 220],
  SS:  [140, 155],
  LF:  [ 60,  75],
  CF:  [200,  45],
  RF:  [340,  75],
  DH:  [370, 330],
};

interface Props {
  lineup: LineupPlayer[];
  guesses: Record<string, string>;
  revealed: Record<string, boolean>;
  featuredPlayer: string;
  onGuess: (pos: string, val: string) => void;
  onReveal: (pos: string) => void;
}

function posColor(pos: string, guesses: Record<string, string>, revealed: Record<string, boolean>, lineup: LineupPlayer[], featuredPlayer: string) {
  const lp = lineup.find((l) => l.position === pos);
  if (!lp) return "#374151";
  if (lp.player === featuredPlayer) return "#d97706"; // amber for featured
  if (revealed[pos]) return "#991b1b";
  if (guesses[pos] && namesMatch(guesses[pos], lp.player)) return "#166534";
  if (guesses[pos]) return "#1e3a5f"; // wrong guess still showing
  return "#1f2937";
}

export default function BaseballDiamond({ lineup, guesses, revealed, featuredPlayer, onGuess, onReveal }: Props) {
  const positions = lineup.map((l) => l.position);

  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 400 380" className="w-full h-auto" aria-label="Baseball diamond">
        {/* Outfield grass */}
        <ellipse cx="200" cy="160" rx="195" ry="150" fill="#14532d" />
        {/* Infield dirt */}
        <polygon points="200,330 330,200 200,70 70,200" fill="#92400e" />
        {/* Infield grass */}
        <polygon points="200,290 300,200 200,110 100,200" fill="#166534" />
        {/* Baselines */}
        <line x1="200" y1="330" x2="330" y2="200" stroke="#fff" strokeWidth="2" />
        <line x1="200" y1="330" x2="70" y2="200" stroke="#fff" strokeWidth="2" />
        <line x1="330" y1="200" x2="200" y2="70" stroke="#fff" strokeWidth="2" />
        <line x1="70" y1="200" x2="200" y2="70" stroke="#fff" strokeWidth="2" />
        {/* Pitcher's mound */}
        <circle cx="200" cy="210" r="10" fill="#92400e" stroke="#fff" strokeWidth="1" />
        {/* Bases */}
        {[[200,330],[330,200],[200,70],[70,200]].map(([x,y],i) => (
          <rect key={i} x={x-8} y={y-8} width="16" height="16" fill="white" rx="2" />
        ))}

        {positions.map((pos) => {
          const coords = POSITIONS[pos];
          if (!coords) return null;
          const [cx, cy] = coords;
          const fill = posColor(pos, guesses, revealed, lineup, featuredPlayer);
          const lp = lineup.find((l) => l.position === pos)!;
          const isCorrect = namesMatch(guesses[pos] ?? "", lp.player);
          const isFeature = lp.player === featuredPlayer;

          return (
            <g key={pos}>
              <circle cx={cx} cy={cy} r="22" fill={fill} stroke={isFeature ? "#f97316" : isCorrect ? "#22c55e" : "#374151"} strokeWidth="2" />
              <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{pos}</text>
              <text x={cx} y={cy + 6} textAnchor="middle" fill="#9ca3af" fontSize="7">
                {isFeature ? lp.player.split(" ").pop() : isCorrect || revealed[pos] ? lp.player.split(" ").pop()?.slice(0, 8) : "???"}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Input grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {lineup.map((lp) => {
          const isFeature = lp.player === featuredPlayer;
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          const isRevealed = revealed[lp.position];

          return (
            <div key={lp.position} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">{lp.position}</span>
                {lp.battingOrder !== undefined && lp.battingOrder > 0 && (
                  <span className="text-xs text-gray-600">#{lp.battingOrder}</span>
                )}
              </div>
              {isFeature ? (
                <div className="px-2 py-1.5 rounded bg-orange-900/30 border border-orange-700 text-orange-300 text-xs font-semibold truncate">
                  {lp.player} ★
                </div>
              ) : isCorrect ? (
                <div className="px-2 py-1.5 rounded bg-green-900/30 border border-green-700 text-green-300 text-xs font-semibold truncate">
                  ✓ {lp.player}
                </div>
              ) : isRevealed ? (
                <div className="px-2 py-1.5 rounded bg-red-900/20 border border-red-800 text-red-400 text-xs truncate">
                  {lp.player}
                </div>
              ) : (
                <div className="flex gap-1">
                  <input
                    className="flex-1 min-w-0 px-2 py-1 bg-brand-dark border border-brand-border rounded text-white text-xs outline-none focus:ring-1 focus:ring-brand-accent/60"
                    placeholder="Name…"
                    value={guesses[lp.position] ?? ""}
                    onChange={(e) => onGuess(lp.position, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onGuess(lp.position, (e.target as HTMLInputElement).value)}
                  />
                  <button
                    onClick={() => onReveal(lp.position)}
                    className="px-1.5 py-1 text-xs border border-brand-border text-gray-500 rounded hover:text-red-400 hover:border-red-700 transition"
                    title="-50 pts"
                  >👁</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
