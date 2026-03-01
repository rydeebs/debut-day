"use client";
import { useState, useEffect } from "react";
import { Sport, PlayerData, PLAYERS_BY_SPORT } from "@/data/players";
import {
  getDailyPlayer,
  saveHighScore,
  saveDailyRecord,
  buildShareText,
  formatDate,
  POINTS,
} from "@/lib/gameUtils";
import Challenge1 from "./Challenge1";
import Challenge2 from "./Challenge2";
import Challenge3 from "./Challenge3";
import Leaderboard from "./Leaderboard";
import ShareModal from "./ShareModal";

const SPORTS: { key: Sport; label: string; icon: string }[] = [
  { key: "baseball",   label: "Baseball",   icon: "⚾" },
  { key: "basketball", label: "Basketball", icon: "🏀" },
  { key: "football",   label: "Football",   icon: "🏈" },
  { key: "hockey",     label: "Hockey",     icon: "🏒" },
  { key: "soccer",     label: "Soccer",     icon: "⚽" },
];

const TEAM_LOGOS: Record<string, string> = {
  "Philadelphia Phillies":  "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png",
  "New York Yankees":       "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
  "St. Louis Cardinals":    "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png",
  "Cleveland Cavaliers":    "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",
  "Los Angeles Lakers":     "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
  "Seattle SuperSonics":    "https://a.espncdn.com/i/teamlogos/nba/500/sea.png",
  "Kansas City Chiefs":     "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
  "New England Patriots":   "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png",
  "Green Bay Packers":      "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png",
  "Pittsburgh Penguins":    "https://a.espncdn.com/i/teamlogos/nhl/500/pit.png",
  "Washington Capitals":    "https://a.espncdn.com/i/teamlogos/nhl/500/wsh.png",
  "San Jose Earthquakes":   "https://a.espncdn.com/i/teamlogos/soccer/500/193.png",
  "New England Revolution": "https://a.espncdn.com/i/teamlogos/soccer/500/210.png",
};

type GameMode = "daily" | "browse";
type ChallengeStep = 1 | 2 | 3 | "done";

interface GameSession {
  c1Score: number;
  c2Score: number;
  c3Score: number;
  c2CorrectMap: Record<string, boolean>;
}

export default function Game() {
  const [sport, setSport] = useState<Sport>("baseball");
  const [mode, setMode] = useState<GameMode>("daily");
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [step, setStep] = useState<ChallengeStep>(1);
  const [session, setSession] = useState<GameSession>({
    c1Score: 0, c2Score: 0, c3Score: 0, c2CorrectMap: {},
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const p = mode === "daily"
      ? getDailyPlayer(sport)
      : PLAYERS_BY_SPORT[sport][0];
    setPlayer(p);
    setStep(1);
    setSession({ c1Score: 0, c2Score: 0, c3Score: 0, c2CorrectMap: {} });
  }, [sport, mode]);

  function handleC1Complete(score: number) {
    setSession((s) => ({ ...s, c1Score: score }));
    setStep(2);
  }

  function handleC2Complete(score: number, correctMap: Record<string, boolean>) {
    setSession((s) => ({ ...s, c2Score: score, c2CorrectMap: correctMap }));
    setStep(3);
  }

  function handleC3Complete(score: number) {
    const finalSession = { ...session, c3Score: score };
    setSession(finalSession);
    setStep("done");

    const total = finalSession.c1Score + finalSession.c2Score + score + POINTS.completionBonus;
    saveHighScore(sport, total);
    if (mode === "daily") {
      saveDailyRecord({
        date: new Date().toISOString().split("T")[0],
        sport,
        playerId: player!.id,
        score: total,
        completed: true,
      });
    }
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }

  const totalScore = session.c1Score + session.c2Score + session.c3Score +
    (step === "done" ? POINTS.completionBonus : 0);

  const shareText = player && step === "done"
    ? buildShareText(player, session.c1Score, session.c2CorrectMap, session.c3Score, totalScore)
    : "";

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Confetti overlay */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 10}%`,
                background: ["#f97316","#22c55e","#3b82f6","#eab308","#ec4899"][i % 5],
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${1.5 + Math.random()}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-brand-border bg-brand-card sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-2xl text-brand-accent tracking-widest uppercase leading-none">
              Debut Day
            </h1>
            <p className="text-xs text-gray-500 tracking-wide mt-0.5">Sports Debut Trivia</p>
          </div>
          <div className="flex items-center gap-3">
            {step !== 1 && (
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-heading">Score</div>
                <div className="text-xl font-heading font-black text-brand-accent leading-none">{totalScore}</div>
              </div>
            )}
            <button
              onClick={() => setShowLeaderboard((v) => !v)}
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 border border-brand-border rounded-lg transition hover:border-gray-500"
            >
              🏆
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Leaderboard */}
        {showLeaderboard && <Leaderboard />}

        {/* Sport tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SPORTS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSport(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-heading font-bold tracking-wide whitespace-nowrap transition flex-shrink-0 uppercase ${
                sport === key
                  ? "bg-brand-accent text-white shadow-lg shadow-orange-500/20"
                  : "bg-brand-card border border-brand-border text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
          {(["daily", "browse"] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-heading font-bold tracking-wide uppercase transition ${
                mode === m
                  ? "bg-white/10 text-white border border-white/15 shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "daily" ? "📅 Daily" : "📚 Browse"}
            </button>
          ))}
        </div>

        {/* Browse player picker */}
        {mode === "browse" && (
          <div className="flex flex-wrap gap-2">
            {PLAYERS_BY_SPORT[sport].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlayer(p);
                  setStep(1);
                  setSession({ c1Score: 0, c2Score: 0, c3Score: 0, c2CorrectMap: {} });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  player?.id === p.id
                    ? "bg-brand-accent border-brand-accent text-white"
                    : "bg-brand-dark border-brand-border text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {p.player}
              </button>
            ))}
          </div>
        )}

        {player && (
          <>
            {/* Player card */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-5 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-3xl text-white tracking-wide leading-tight">
                    {player.player}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="text-gray-300 font-medium">{player.team}</span>
                    <span className="mx-1.5 text-gray-600">·</span>
                    {player.position}
                    <span className="mx-1.5 text-gray-600">·</span>
                    Debut: {formatDate(player.debutDate)}
                  </p>
                </div>
                {/* Team logo */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center overflow-hidden p-1.5">
                  {TEAM_LOGOS[player.team] ? (
                    <img
                      src={TEAM_LOGOS[player.team]}
                      alt={player.team}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const el = (e.target as HTMLImageElement).parentElement;
                        if (el) el.innerHTML = `<span style="font-size:1.1rem;font-weight:900;color:#4b5563">${player.team.slice(0,2).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className="font-heading font-black text-xl text-gray-600">
                      {player.team.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress steps */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      step === "done" || (typeof step === "number" && step > n)
                        ? "bg-green-500"
                        : step === n
                        ? "bg-brand-accent"
                        : "bg-brand-border"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-1.5">
                {["Predecessor", "Lineup", "Jersey #"].map((label, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-gray-600 font-heading tracking-wide uppercase">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <Challenge1 key={`c1-${player.id}`} player={player} onComplete={handleC1Complete} />

            {(step === 2 || step === 3 || step === "done") && (
              <Challenge2 key={`c2-${player.id}`} player={player} onComplete={handleC2Complete} />
            )}

            {(step === 3 || step === "done") && (
              <Challenge3 key={`c3-${player.id}`} player={player} onComplete={handleC3Complete} />
            )}

            {/* Final score */}
            {step === "done" && (
              <div className="bg-brand-card border border-brand-accent/40 rounded-xl p-6 text-center animate-slide-up shadow-xl shadow-orange-500/5">
                <div className="font-heading font-black text-6xl text-brand-accent mb-1 tracking-wide">
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-widest font-heading mb-4">Total Points</div>

                <div className="grid grid-cols-4 gap-2 my-4 text-xs">
                  {[
                    { label: "Predecessor", value: session.c1Score },
                    { label: "Lineup",      value: session.c2Score },
                    { label: "Jersey #",    value: session.c3Score },
                    { label: "Completion",  value: POINTS.completionBonus },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-brand-dark rounded-lg p-2.5 border border-brand-border">
                      <div className="text-gray-500 text-xs uppercase tracking-wide font-heading">{label}</div>
                      <div className="font-heading font-bold text-lg text-white mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  <ShareModal shareText={shareText} />
                  <button
                    onClick={() => {
                      setMode("browse");
                      setStep(1);
                      setSession({ c1Score: 0, c2Score: 0, c3Score: 0, c2CorrectMap: {} });
                    }}
                    className="px-4 py-2 border border-brand-border text-gray-400 hover:text-white hover:border-gray-500 rounded-lg text-sm transition font-medium"
                  >
                    Try Another Player
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
