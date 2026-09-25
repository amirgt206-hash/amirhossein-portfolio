"use client";

import { useEffect } from "react";

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

/* ═══════════════════════════════════════════════════════════
   HAPTIC PATTERNS — Using arrays for wider compatibility
   ------------------------------------------------------------
   Single duration values < 1000ms are ignored on some Android
   devices (Pixel 9, Android 16). Using array patterns with a
   leading pause forces the motor to engage reliably.
   ═══════════════════════════════════════════════════════════ */

const HAPTIC: Record<SensoryKind, number[]> = {
  tap: [0, 30],
  select: [0, 40],
  toggle: [0, 35],
  snap: [0, 30],
  swipe: [0, 20],
  longPress: [0, 50],
  success: [0, 40, 60, 40],
  error: [0, 60, 80, 60],
};

/* ═══════════════════════════════════════════════════════════
   iOS HAPTIC — Taptic Engine via hidden checkbox
   ═══════════════════════════════════════════════════════════ */
let iosHapticInput: HTMLInputElement | null = null;

function ensureIosHapticInput() {
  if (typeof document === "undefined") return null;
  if (iosHapticInput) return iosHapticInput;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  input.style.width = "1px";
  input.style.height = "1px";
  input.setAttribute("aria-hidden", "true");
  input.tabIndex = -1;
  document.body.appendChild(input);
  iosHapticInput = input;
  return input;
}

function triggerIosHaptic() {
  const input = ensureIosHapticInput();
  if (!input) return;
  try {
    input.click();
  } catch {
    /* ignore */
  }
}

/* ═══════════════════════════════════════════════════════════
   VIBRATE — with platform detection and fallbacks
   ═══════════════════════════════════════════════════════════ */
function vibrate(pattern: number[]) {
  if (typeof navigator === "undefined") return;

  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window);

  if (isIOS) {
    /* iOS — use the checkbox trick (fires once per click) */
    triggerIosHaptic();
    return;
  }

  /* Android + others — navigator.vibrate() */
  if ("vibrate" in navigator) {
    try {
      const accepted = navigator.vibrate(pattern);
      /* Log for debugging */
      if (process.env.NODE_ENV === "development") {
        console.log("[haptic] vibrate", pattern, "accepted:", accepted);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[haptic] vibrate failed:", err);
      }
    }
  }
}

/* ── Audio ── */
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
    if (ctx.state === "suspended") ctx.resume();
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
    playTone({ freq: 320, duration: 0.12, volume: 0.025, type: "triangle" });
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

function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SOUND_PREF_KEY) === "1";
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════════ */
export function triggerSensory(kind: SensoryKind) {
  /* Haptic first — MUST be synchronous within user gesture */
  vibrate(HAPTIC[kind]);
  /* Sound second */
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

/* ═══════════════════════════════════════════════════════════
   SELECTORS
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   COMPONENT — attaches listener on `touchstart` AND `pointerdown`
   ------------------------------------------------------------
   Using `touchstart` on touch devices is more reliable than
   `pointerdown` because the gesture token is fresher and no
   other pointer handler can interfere.
   ═══════════════════════════════════════════════════════════ */
export default function SensoryFeedback() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    const handleEvent = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      let kind: SensoryKind | null = null;

      if (target.closest(SNAP_SELECTOR)) kind = "snap";
      else if (target.closest(SELECT_SELECTOR)) kind = "select";
      else if (target.closest(TOGGLE_SELECTOR)) kind = "toggle";
      else if (target.closest(TAP_SELECTOR)) kind = "tap";

      if (kind) triggerSensory(kind);
    };

    /*
     * On touch devices, use `touchstart` — it's the most reliable
     * gesture source for the Vibration API. Using `pointerdown`
     * works too, but `touchstart` fires first and cannot be
     * cancelled by other handlers.
     */
    const eventName = isTouch ? "touchstart" : "pointerdown";

    document.addEventListener(eventName, handleEvent, { passive: true });

    return () => {
      document.removeEventListener(eventName, handleEvent);
    };
  }, []);

  return null;
}