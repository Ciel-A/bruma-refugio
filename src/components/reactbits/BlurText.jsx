"use client";

import { motion, useReducedMotion } from "motion/react";

// Revela el texto palabra por palabra (opacity + blur + y). Re-animá cambiando la `key` desde el padre.
export default function BlurText({ text, className = "", delay = 0, stagger = 0.045, duration = 0.45 }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden="true"
          initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block will-change-transform"
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
