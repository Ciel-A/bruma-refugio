"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export default function DrawerShell({ open, onClose, title, badge, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && [
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
        />,
        <motion.aside
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col overflow-y-auto border-l border-white/10 bg-[#0B0B0D]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-medium tracking-tight text-white">
                {title}
              </h2>
              {badge && (
                <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                  {badge}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 px-6 py-6">{children}</div>
        </motion.aside>,
      ]}
    </AnimatePresence>
  );
}
