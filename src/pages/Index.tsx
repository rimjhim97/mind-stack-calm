import { useTimer } from "@/hooks/useTimer";
import { Play, Pause, RotateCcw } from "lucide-react";

const Index = () => {
  const { mode, status, display, sessions, progress, start, pause, reset } = useTimer();
  const isBreak = mode === "break";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Title */}
      <header className="mb-16 text-center animate-fade-in">
        <h1 className="text-lg font-medium tracking-widest uppercase text-muted-foreground">
          FocusStack
        </h1>
      </header>

      {/* Mode Indicator */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors duration-500 ${
            isBreak
              ? "bg-[hsl(var(--break-accent)/0.15)] text-[hsl(var(--break-accent))]"
              : "bg-primary/15 text-primary"
          }`}
        >
          {isBreak ? "Break" : "Focus"}
        </span>
      </div>

      {/* Timer Ring */}
      <div
        className={`relative mb-12 flex h-64 w-64 items-center justify-center rounded-full border border-border/50 transition-all duration-500 ${
          status === "running"
            ? isBreak
              ? "animate-pulse-glow-break"
              : "animate-pulse-glow"
            : ""
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        {/* Progress SVG */}
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 256 256"
          fill="none"
        >
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke={
              isBreak ? "hsl(var(--break-accent))" : "hsl(var(--primary))"
            }
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time Display */}
        <span className="font-mono-timer text-6xl font-light tracking-tight text-foreground">
          {display}
        </span>
      </div>

      {/* Controls */}
      <div
        className="flex items-center gap-4 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        {status === "running" ? (
          <button
            onClick={pause}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 hover:scale-105 active:scale-95"
            aria-label="Pause"
          >
            <Pause className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={start}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
              isBreak
                ? "bg-[hsl(var(--break-accent))] text-[hsl(var(--background))]"
                : "bg-primary text-primary-foreground"
            }`}
            aria-label="Start"
          >
            <Play className="h-5 w-5 ml-0.5" />
          </button>
        )}

        <button
          onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:scale-105 active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Session Counter */}
      <p
        className="mt-16 text-sm text-muted-foreground animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        {sessions === 0
          ? "No sessions yet"
          : `${sessions} session${sessions > 1 ? "s" : ""} completed`}
      </p>
    </main>
  );
};

export default Index;
