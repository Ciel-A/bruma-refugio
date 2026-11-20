"use client";

import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import BookingDock from "@/components/BookingDock";
import BlurText from "@/components/reactbits/BlurText";

const EASE = [0.22, 1, 0.36, 1];

export default function ExteriorHero() {
  const { activeCabinId } = useBooking();
  const cabin = getCabinById(activeCabinId);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-[#050505]">
      <AnimatePresence mode="sync">
        <motion.img
          key={cabin.id}
          src={cabin.exteriorImage}
          alt={`Cabaña ${cabin.name}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Viñeta superior + gradiente inferior de legibilidad */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />

      <div className="absolute bottom-[23rem] left-5 right-5 z-10 md:left-12 lg:bottom-36 lg:max-w-3xl">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.08em] text-available">
          — Retiro de bosque nativo · Patagonia
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={cabin.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <h1 className="font-display text-[36px] font-medium leading-[1.03] tracking-tight text-white sm:text-[40px] md:text-7xl">
              <BlurText key={cabin.id} text={cabin.headline} />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              {cabin.shortDescription}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <BookingDock />
    </section>
  );
}
