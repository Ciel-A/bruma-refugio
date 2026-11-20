"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");

export default function InteriorLightbox({ items, index, onIndex, onClose }) {
  const total = items.length;
  const item = items[index];

  useEffect(() => {
    const prev = () => onIndex((index - 1 + total) % total);
    const next = () => onIndex((index + 1) % total);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onIndex, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:bg-white/10 md:right-8 md:top-8"
      >
        <X size={18} />
      </button>

      <button
        type="button"
        aria-label="Anterior"
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index - 1 + total) % total);
        }}
        className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-surface/80 text-white transition-colors hover:bg-white/10 md:left-8"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index + 1) % total);
        }}
        className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-surface/80 text-white transition-colors hover:bg-white/10 md:right-8"
      >
        <ChevronRight size={18} />
      </button>

      <AnimatePresence mode="wait">
        <motion.img
          key={item.id}
          src={item.image}
          alt={item.label}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[82vh] max-w-[90vw] rounded-xl object-contain"
        />
      </AnimatePresence>

      <div
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white">{item.label}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
    </motion.div>
  );
}
