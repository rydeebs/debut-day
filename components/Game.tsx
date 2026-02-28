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

  // Load player when sport/mode changes
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
            <h1 className="text-xl font-black text-brand-accent tracking-tight">🏟️ Debut Day</h1>
            <p className="text-xs text-gray-500">Sports Debut Trivia</p>
          </div>
          <div className="flex items-center gap-3">
            {step !== 1 && (
              <div className="text-right">
                <div className="text-xs text-gray-500">Score</div>
                <div className="text-lg font-black text-brand-accent">{totalScore}</div>
              </div>
            )}
            <button
              onClick={() => setShowLeaderboard((v) => !v)}
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 border border-brand-border rounded-lg transition"
            >
              🏆
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Leaderboard */}
        {showLeaderboard && <Leaderboard />}

        {/* Sport tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SPORTS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSport(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${
                sport === key
                  ? "bg-brand-accent text-white"
                  : "bg-brand-card border border-brand-border text-gray-400 hover:text-white"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["daily", "browse"] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-lg text-sm capitalize font-medium transition ${
                mode === m
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "daily" ? "📅 Daily Puzzle" : "📚 Browse Players"}
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
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  player?.id === p.id
                    ? "bg-brand-accent border-brand-accent text-white"
                    : "bg-brand-dark border-brand-border text-gray-400 hover:text-white"
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
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{player.player}</h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {player.team} · {player.position} · Debut: {formatDate(player.debutDate)}
                  </p>
                </div>
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-600">?</span>
                </div>
              </div>

              {/* Progress steps */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      step === "done" || (typeof step === "number" && step > n)
                        ? "bg-green-500"
                        : step === n
                        ? "bg-brand-accent"
                        : "bg-brand-border"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                {["Predecessor", "Lineup", "Jersey #"].map((label, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-gray-600">{label}</div>
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
              <div className="bg-brand-card border border-brand-accent/50 rounded-xl p-6 text-center animate-slide-up">
                <div className="text-5xl font-black text-brand-accent mb-2">
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm mb-1">Total Points</div>

                <div className="grid grid-cols-4 gap-2 my-4 text-xs">
                  {[
                    { label: "Predecessor", value: session.c1Score },
                    { label: "Lineup", value: session.c2Score },
                    { label: "Jersey #", value: session.c3Score },
                    { label: "Completion", value: POINTS.completionBonus },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-brand-dark rounded-lg p-2">
                      <div className="text-gray-500">{label}</div>
                      <div className="font-bold text-white">{value}</div>
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
                    className="px-4 py-2 border border-brand-border text-gray-400 hover:text-white rounded-lg text-sm transition"
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
