"use client";
import { LineupPlayer } from "@/data/players";
import { namesMatch } from "@/lib/gameUtils";

// 4-4-2 layout, viewBox 0 0 360 480
const POSITIONS: Record<string, [number, number]> = {
  GK:  [180, 430],
  LB:  [ 55, 340],
  CB1: [130, 340],
  CB2: [230, 340],
  RB:  [305, 340],
  LM:  [ 55, 230],
  CM1: [135, 230],
  CM2: [225, 230],
  RM:  [305, 230],
  ST1: [130, 120],
  ST2: [230, 120],
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

export default function SoccerPitch({ lineup, guesses, revealed, featuredPlayer, onGuess, onReveal }: Props) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 360 480" className="w-full h-auto">
        {/* Pitch */}
        <rect width="360" height="480" fill="#14532d" rx="4" />
        <rect x="15" y="15" width="330" height="450" fill="none" stroke="white" strokeWidth="2" rx="2" />
        {/* Halfway line */}
        <line x1="15" y1="240" x2="345" y2="240" stroke="white" strokeWidth="1.5" />
        <circle cx="180" cy="240" r="40" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="180" cy="240" r="4" fill="white" />
        {/* Penalty area (bottom) */}
        <rect x="80" y="380" width="200" height="85" fill="none" stroke="white" strokeWidth="1.5" />
        {/* Goal area (bottom) */}
        <rect x="130" y="440" width="100" height="30" fill="none" stroke="white" strokeWidth="1" />
        {/* Goal */}
        <rect x="148" y="462" width="64" height="14" fill="none" stroke="#ef4444" strokeWidth="2" rx="1" />
        {/* Penalty spot */}
        <circle cx="180" cy="400" r="3" fill="white" />
        {/* Penalty arc */}
        <path d="M 130,380 Q 180,350 230,380" fill="none" stroke="white" strokeWidth="1.5" />

        {lineup.map((lp) => {
          const coords = POSITIONS[lp.position];
          if (!coords) return null;
          const [cx, cy] = coords;
          const fill = nodeColor(lp.position, guesses, revealed, lineup, featuredPlayer);
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          const isFeature = lp.player === featuredPlayer;
          const r = lp.position === "GK" ? 24 : 20;
          return (
            <g key={lp.position}>
              <circle cx={cx} cy={cy} r={r} fill={fill}
                stroke={isFeature ? "#f97316" : isCorrect ? "#22c55e" : "#4b5563"} strokeWidth="2" />
              <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{lp.position}</text>
              <text x={cx} y={cy + 6} textAnchor="middle" fill="#d1d5db" fontSize="6.5">
                {isFeature || isCorrect || revealed[lp.position]
                  ? lp.player.split(" ").pop()?.slice(0, 8)
                  : "???"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {lineup.map((lp) => {
          const isFeature = lp.player === featuredPlayer;
          const isCorrect = namesMatch(guesses[lp.position] ?? "", lp.player);
          return (
            <div key={lp.position} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold">{lp.position}</span>
              {isFeature ? (
                <div className="px-2 py-1.5 rounded bg-orange-900/30 border border-orange-700 text-orange-300 text-xs truncate">{lp.player} ★</div>
              ) : isCorrect ? (
                <div className="px-2 py-1.5 rounded bg-green-900/30 border border-green-700 text-green-300 text-xs truncate">✓ {lp.player}</div>
              ) : revealed[lp.position] ? (
                <div className="px-2 py-1.5 rounded bg-red-900/20 border border-red-800 text-red-400 text-xs truncate">{lp.player}</div>
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
