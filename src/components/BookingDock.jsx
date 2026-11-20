"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Minus, Plus, ArrowRight } from "lucide-react";
import Magnet from "@/components/reactbits/Magnet";
import { useBooking } from "@/context/BookingContext";
import { CABINS, getCabinById } from "@/data/cabinsData";
import { formatShortDate } from "@/lib/format";
import CalendarPopover from "@/components/CalendarPopover";

const Divider = () => (
  <div className="h-px w-full bg-white/10 lg:h-9 lg:w-px lg:shrink-0" />
);

export default function BookingDock() {
  const {
    activeCabinId,
    setActiveCabinId,
    guests,
    setGuests,
    checkIn,
    checkOut,
    setViewMode,
    hydrated,
  } = useBooking();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const cabin = getCabinById(activeCabinId);

  const selectCabin = (c) => {
    setActiveCabinId(c.id);
    if (guests > c.maxGuests) setGuests(c.maxGuests);
  };

  const dateLabel = (d) => (hydrated ? formatShortDate(d) : "—");

  return (
    <div className="absolute inset-x-4 bottom-6 z-20 flex justify-center lg:inset-x-0 lg:bottom-10">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-3.5 rounded-3xl border border-white/12 bg-surface/85 p-3.5 backdrop-blur-md lg:w-auto lg:max-w-none lg:flex-row lg:items-center lg:gap-5 lg:rounded-full lg:py-3 lg:pl-3 lg:pr-3">
        {/* a) Selector de cabañas */}
        <div className="flex items-center justify-between gap-1 lg:justify-start">
          {CABINS.map((c) => {
            const active = c.id === activeCabinId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCabin(c)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full p-1 pr-2.5 text-[12px] transition-colors sm:gap-2 sm:pr-3 sm:text-[13px] ${
                  active ? "bg-white/10 text-white" : "text-muted hover:text-white"
                }`}
              >
                <img
                  src={c.exteriorImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-7 rounded-lg object-cover sm:h-8 sm:w-8"
                />
                <span>{c.name}</span>
                {active && <span className="h-[6px] w-[6px] rounded-full bg-available" />}
              </button>
            );
          })}
        </div>

        <Divider />

        {/* b) Fechas */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCalendarOpen((o) => !o)}
            aria-expanded={calendarOpen}
            className="flex w-full items-center justify-around gap-6 rounded-full px-3 py-1 text-left transition-colors hover:bg-white/5"
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                Check-in
              </span>
              <span className="block text-[13px] text-white">{dateLabel(checkIn)}</span>
            </span>
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                Check-out
              </span>
              <span className="block text-[13px] text-white">{dateLabel(checkOut)}</span>
            </span>
          </button>
          <AnimatePresence>
            {calendarOpen && <CalendarPopover onClose={() => setCalendarOpen(false)} />}
          </AnimatePresence>
        </div>

        <Divider />

        {/* c) Huéspedes */}
        <div className="flex items-center justify-between gap-4 px-2">
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Huéspedes
            </span>
            <span className="block text-[13px] text-white">
              {guests} {guests === 1 ? "adulto" : "adultos"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Menos huéspedes"
              disabled={guests <= 1}
              onClick={() => setGuests(guests - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus size={13} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Más huéspedes"
              disabled={guests >= cabin.maxGuests}
              onClick={() => setGuests(guests + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Plus size={13} strokeWidth={1.5} />
            </button>
          </span>
        </div>

        <Divider />

        {/* d) CTA */}
        <Magnet className="w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("interior")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-[#050505] transition-colors hover:bg-white/90"
          >
            Explorar y reservar
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </Magnet>
      </div>
    </div>
  );
}
