"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>";

// Descifrado corto de caracteres. `trigger`: "mount" | "inView".
export default function DecryptedText({
  text,
  duration = 450,
  trigger = "mount",
  className = "font-mono",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(text);
  const active = trigger === "mount" || inView;

  useEffect(() => {
    if (!active || reduce) return;
    const start = performance.now();
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / duration);
      const revealed = Math.floor(p * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            i < revealed || ch === " " || !/[A-Za-z0-9]/.test(ch)
              ? ch
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      if (p >= 1) {
        clearInterval(id);
        setDisplay(text);
      }
    }, 30);
    return () => clearInterval(id);
  }, [active, reduce, text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
