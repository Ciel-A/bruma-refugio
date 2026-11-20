"use client";

import { useRef } from "react";

// Tarjeta con resplandor radial sutil que sigue al mouse.
export default function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative overflow-hidden ${className}`}
      style={{ "--x": "50%", "--y": "50%" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--x) var(--y), rgba(255,255,255,0.07), transparent 70%)",
        }}
      />
      <div className="relative flex h-full flex-col justify-between">{children}</div>
    </div>
  );
}
