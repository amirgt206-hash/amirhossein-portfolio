"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   FORM PROGRESS
   ------------------------------------------------------------
   Subtle sticky progress bar that appears at the top of the
   form. Shows completion percentage with smooth animation.

   Auto-hides when form is 100% complete (user is about to
   submit anyway).
   ═══════════════════════════════════════════════════════════ */

type Props = {
  /** Percentage 0-100 */
  progress: number;
  /** Label shown next to the bar */
  label?: string;
};

export default function FormProgress({ progress, label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Show only when user has started */
    if (progress > 5 && progress < 100) {
      setVisible(true);
    } else if (progress >= 100) {
      /* Auto-hide on completion after short delay */
      const timer = window.setTimeout(() => setVisible(false), 400);
      return () => window.clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      className="form-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "پیشرفت فرم"}
    >
      <div className="form-progress-track">
        <div
          className="form-progress-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <span className="form-progress-label">
        {Math.round(progress)}٪ کامل
      </span>
    </div>
  );
}