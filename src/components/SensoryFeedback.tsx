"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   SENSORY FEEDBACK — Haptic + Sound
   ------------------------------------------------------------
   Haptic: uses navigator.vibrate() — Android only, gracefully
           no-ops on iOS (Safari doesn't support it).
   Sound:  uses Web Audio API to synthesize subtle tones on the
           fly — no files, no bandwidth, no latency.
           Off by default; user can enable via SoundToggle.
   ═══════════════════════════════════════════════════════════ */

/* Haptic patterns (ms) */
const HAPTIC = {
  tap: 8,
  select: 12,
  toggle: 10,
  success: [12, 40, 12],
  error: [18, 60, 18],
  longPress: 15,
  swipe: 6,
  snap: 10,
};

/* Sound preferences key */
export const SOUND_PREF_KEY = "sound-enabled";

/* Audio context (lazy, shared) */
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

/* Synthesize a subtle tone — extremely quiet by default */
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
    /* Resume context if suspended (autoplay policy) */
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    /* Envelope: attack + quick exponential decay */
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

/* ── Sound presets ── */
const SOUND = {
  tap: () => playTone({ freq: 520, duration: 0.05, volume: 0.015 }),
  select: () => playTone({ freq: 660, duration: 0.07, volume: 0.02 }),
  toggle: () => playTone({ freq: 780, duration: 0.08, volume: 0.02 }),
  success: () => {
    playTone({ freq: 660, duration: 0.1, volume: 0.025 });
    window.setTimeout(
      () => playTone({ freq: 880, duration: 0.14, volume: 0.025 }),
      90
    );
  },
  error: () => {
    playTone({ freq: 320, duration: 0.12, volume: 0.025, type: "triangle" });
    window.setTimeout(
      () => playTone({ freq: 260, duration: 0.16, volume: 0.025, type: "triangle" }),
      110
    );
  },
};

/* ── Haptic helper ── */
function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/* ── Sound enabled check ── */
function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SOUND_PREF_KEY) === "1";
  } catch {
    return false;
  }
}

/* ── Global sensory trigger (used by other components) ── */
export type SensoryKind =
  | "tap"
  | "select"
  | "toggle"
  | "success"
  | "error"
  | "longPress"
  | "swipe"
  | "snap";

export function triggerSensory(kind: SensoryKind) {
  /* Haptic — always (if device supports) */
  const hapticPattern = HAPTIC[kind as keyof typeof HAPTIC];
  if (hapticPattern !== undefined) {
    vibrate(hapticPattern);
  }

  /* Sound — only if user opted in */
  if (isSoundEnabled()) {
    const soundFn = SOUND[kind as keyof typeof SOUND];
    soundFn?.();
  }
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT — attaches global listeners
   ═══════════════════════════════════════════════════════════ */
export default function SensoryFeedback() {
  const enabled = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isTouch && !isSoundEnabled()) return;
    if (reducedMotion) return;

    enabled.current = true;

    /* ── Pointerdown: tap haptic on interactive elements ── */
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      /* Primary CTAs — distinct haptic */
      if (
        target.closest(
          '.btn-primary, .button-primary, .nav-order-button, .mobile-nav-cta, .project-modal-nav-demo, [data-sensory="snap"]'
        )
      ) {
        triggerSensory("snap");
        return;
      }

      /* Selectable options */
      if (
        target.closest(
          '.project-type-option, .contact-method, .blog-tag-chip, [data-sensory="select"]'
        )
      ) {
        triggerSensory("select");
        return;
      }

      /* Toggles */
      if (
        target.closest('.theme-toggle, .form-checkbox, [data-sensory="toggle"]')
      ) {
        triggerSensory("toggle");
        return;
      }

      /* Generic tap */
      if (
        target.closest(
          'a, button, [role="button"], .btn, .button, .faq-question, [data-sensory="tap"]'
        )
      ) {
        triggerSensory("tap");
      }
    };

    /* ── Success / error from form events ── */
    const handleFormResult = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.kind === "success") triggerSensory("success");
      else if (detail?.kind === "error") triggerSensory("error");
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("sensory:result", handleFormResult);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("sensory:result", handleFormResult);
      enabled.current = false;
    };
  }, []);

  return null;
}

/* ── Utility for other components ── */
export function dispatchSensoryResult(kind: "success" | "error") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("sensory:result", { detail: { kind } })
  );
}