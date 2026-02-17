

# FocusStack — Pomodoro Timer for MBA Students

A minimal, modern Pomodoro timer with a calm, professional aesthetic. Dark mode by default, Apple-inspired design.

## Core Features

### 1. Focus Timer
- **25-minute countdown** displayed as a large, centered timer with clean typography
- **5-minute break timer** that automatically starts after each focus session
- Visual indicator showing whether you're in "Focus" or "Break" mode

### 2. Controls
- **Start / Pause / Reset** buttons with subtle hover animations
- Clean, minimal button design inspired by Linear's UI

### 3. Session Tracking
- Session counter that increments after each completed focus session
- Displayed unobtrusively below the timer

### 4. Notification
- Soft audio chime when a timer completes (generated programmatically, no external files needed)

## Design & Experience

- **Dark mode by default** with deep, calming background tones
- **Minimal layout**: everything centered on a single page, no clutter
- **Smooth animations**: fade transitions between focus/break, subtle pulse on the active timer
- **Typography**: clean sans-serif, large timer digits, muted secondary text
- **Responsive**: optimized for laptop screens, works well on tablets too
- **Color palette**: muted blues/purples for accents against dark backgrounds — calm and professional

## Technical Approach
- Single-page React app (fits the existing project setup)
- No backend needed — all client-side with local state
- Audio notification generated via Web Audio API (no external sound files)

