"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   SENSORY FEEDBACK — Haptic + Sound (fixed)
   ------------------------------------------------------------
   - Listeners always attached (no conditional mount)
   - Sound preference checked at runtime (not at mount)
   - Haptic works on Android regardless of sound
   - Sound toggle state read from localStorage on every tap
   ═══════════════════════════════════════════════════════════ */

export const SOUND_PREF_KEY = "sound-enabled";

export type SensoryKind =
  | "tap"
  | "select"
  | "toggle"
  | "success"
  | "error"
  | "longPress"
  | "swipe"
  | "snap";

const HAPTIC: Record<SensoryKind, number | number[]> = {
  tap: 8,
  select: 12,
  toggle: 10,
  success: [12, 40, 12],
  error: [18, 60, 18],
  longPress: 15,
  swipe: 6,
  snap: 10,
};

/* ── Shared AudioContext ── */
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioCtx) return audioCtx;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctx();
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone({
  freq,
  duration = 0.08,
  type = "sine",
  volume = 0.02,
}: {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
}) {
  const ctx = getAudioCtx();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    /* ignore */
  }
}

const SOUND: Record<SensoryKind, () => void> = {
  tap: () => playTone({ freq: 520, duration: 0.05, volume: 0.015 }),
  select: () => playTone({ freq: 660, duration: 0.07, volume: 0.02 }),
  toggle: () => playTone({ freq: 780, duration: 0.08, volume: 0.02 }),
  snap: () => playTone({ freq: 580, duration: 0.06, volume: 0.018 }),
  swipe: () => playTone({ freq: 440, duration: 0.04, volume: 0.012 }),
  longPress: () => playTone({ freq: 480, duration: 0.06, volume: 0.018 }),
  success: () => {
    playTone({ freq: 660, duration: 0.1, volume: 0.025 });
    window.setTimeout(
      () => playTone({ freq: 880, duration: 0.14, volume: 0.025 }),
      90
    );
  },
  error: () => {
    playTone({
      freq: 320,
      duration: 0.12,
      volume: 0.025,
      type: "triangle",
    });
    window.setTimeout(
      () =>
        playTone({
          freq: 260,
          duration: 0.16,
          volume: 0.025,
          type: "triangle",
        }),
      110
    );
  },
};

/* ── Helpers ── */
function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SOUND_PREF_KEY) === "1";
  } catch {
    return false;
  }
}

/* ── Global trigger ── */
export function triggerSensory(kind: SensoryKind) {
  vibrate(HAPTIC[kind]);
  if (isSoundEnabled()) {
    SOUND[kind]();
  }
}

export function dispatchSensoryResult(kind: "success" | "error") {
  triggerSensory(kind);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("sensory:result", { detail: { kind } })
    );
  }
}

/* ── Component ── */
const SNAP_SELECTOR = [
  ".btn-primary",
  ".button-primary",
  ".nav-order-button",
  ".mobile-nav-cta",
  ".project-modal-nav-demo",
  '[data-sensory="snap"]',
].join(",");

const SELECT_SELECTOR = [
  ".project-type-option",
  ".contact-method",
  ".blog-tag-chip",
  '[data-sensory="select"]',
].join(",");

const TOGGLE_SELECTOR = [
  ".theme-toggle",
  ".form-checkbox",
  ".sound-toggle",
  '[data-sensory="toggle"]',
].join(",");

const TAP_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  ".btn",
  ".button",
  ".faq-question",
  '[data-sensory="tap"]',
].join(",");

export default function SensoryFeedback() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      let kind: SensoryKind | null = null;

      if (target.closest(SNAP_SELECTOR)) kind = "snap";
      else if (target.closest(SELECT_SELECTOR)) kind = "select";
      else if (target.closest(TOGGLE_SELECTOR)) kind = "toggle";
      else if (target.closest(TAP_SELECTOR)) kind = "tap";

      if (kind) triggerSensory(kind);
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}