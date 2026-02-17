import { useState, useRef, useCallback, useEffect } from "react";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type TimerMode = "focus" | "break";
type TimerStatus = "idle" | "running" | "paused";

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const start = useCallback(() => setStatus("running"), []);
  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setMode("focus");
    setTimeLeft(FOCUS_DURATION);
  }, [clearTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const totalDuration = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = 1 - timeLeft / totalDuration;

  return { mode, status, display, sessions, progress, start, pause, reset };
}
