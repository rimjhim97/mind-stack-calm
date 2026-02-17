import { useState, useRef, useCallback, useEffect } from "react";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type TimerMode = "focus" | "break";
type TimerStatus = "idle" | "running" | "paused";

const MOTIVATIONAL_TEMPLATES = [
  "Stay locked in. Completing {goal} moves you closer to placement day.",
  "Every minute on {goal} is an investment in your future career.",
  "Champions don't quit. Keep pushing through {goal}.",
  "Your competitors are resting. You're crushing {goal}.",
  "Deep focus on {goal} — this is what separates the top 1%.",
  "The case won't crack itself. Stay sharp on {goal}.",
  "Focus is your superpower. Channel it into {goal}.",
  "One session at a time. {goal} is getting done.",
  "This is your edge. Finish {goal} and own the room.",
  "Discipline beats talent. Stay with {goal} — you've got this.",
];

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [sessions, setSessions] = useState(0);
  const [goal, setGoal] = useState("");
  const [currentMotivation, setCurrentMotivation] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedIndicesRef = useRef<Set<number>>(new Set());

  const pickMotivation = useCallback((goalText: string) => {
    const available = MOTIVATIONAL_TEMPLATES
      .map((_, i) => i)
      .filter((i) => !usedIndicesRef.current.has(i));

    if (available.length === 0) {
      usedIndicesRef.current.clear();
      return pickMotivation(goalText);
    }

    const idx = available[Math.floor(Math.random() * available.length)];
    usedIndicesRef.current.add(idx);
    return MOTIVATIONAL_TEMPLATES[idx].replace("{goal}", goalText || "your goal");
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio not available
    }
  }, []);

  const handleComplete = useCallback(() => {
    clearTimer();
    playChime();
    if (mode === "focus") {
      setSessions((s) => s + 1);
      setMode("break");
      setTimeLeft(BREAK_DURATION);
      setStatus("running");
    } else {
      setMode("focus");
      setTimeLeft(FOCUS_DURATION);
      setStatus("idle");
    }
  }, [mode, clearTimer, playChime]);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [status, handleComplete, clearTimer]);

  const start = useCallback(() => {
    if (mode === "focus" && status === "idle") {
      setCurrentMotivation(pickMotivation(goal));
    }
    setStatus("running");
  }, [mode, status, goal, pickMotivation]);

  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setMode("focus");
    setTimeLeft(FOCUS_DURATION);
    setGoal("");
    setCurrentMotivation("");
  }, [clearTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const totalDuration = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = 1 - timeLeft / totalDuration;

  return {
    mode, status, display, sessions, progress,
    goal, setGoal, currentMotivation,
    start, pause, reset,
  };
}
