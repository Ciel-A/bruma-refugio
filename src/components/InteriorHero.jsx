"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import Magnet from "@/components/reactbits/Magnet";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useBooking } from "@/context/BookingContext";
import { CABINS } from "@/data/cabinsData";
import { formatShortDate } from "@/lib/format";

const pad = (n) => String(n).padStart(2, "0");

export default function InteriorHero({ cabin, roomIndex, onRoom, onOpenLightbox }) {
  const {
    setViewMode,
    setActiveCabinId,
    guests,
    setGuests,
    bookings,
    checkIn,
    checkOut,
    hydrated,
    setIsDrawerOpen,
    setIsMyBookingsOpen,
  } = useBooking();
  const room = cabin.rooms[roomIndex];

  const nights =
    hydrated && checkIn && checkOut
      ? Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)))
      : 0;

  const selectCabin = (c) => {
    setActiveCabinId(c.id);
    if (guests > c.maxGuests) setGuests(c.maxGuests);
  };

  const renderThumb = (r, i) => {
    const active = i === roomIndex;
    return (
      <button
        key={r.id}
        type="button"
        onMouseEnter={() => onRoom(i)}
        onClick={() => onRoom(i)}
        aria-label={r.label}
        aria-pressed={active}
        className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl transition-all ${
          active ? "opacity-100 ring-1 ring-white/80" : "opacity-50 hover:opacity-85"
        }`}
      >
        <img src={r.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </button>
    );
  };

  return (
    <>
      {/* Barra superior única */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 bg-[#050505]/80 px-5 py-4 backdrop-blur-md md:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setViewMode("exterior")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[13px] text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Volver al exterior</span>
          </button>
          <span className="hidden h-5 w-px bg-white/10 sm:block" />
          <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:block">
            Bruma · Refugio {cabin.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/10 bg-surface/80 p-0.5">
            {CABINS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCabin(c)}
                aria-pressed={c.id === cabin.id}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  c.id === cabin.id ? "bg-white/10 text-white" : "text-muted hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsMyBookingsOpen(true)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-3 py-2 text-xs text-white transition-colors hover:bg-white/10"
          >
            <span className="h-[6px] w-[6px] rounded-full bg-available" />
            <span className="hidden sm:inline">Mis reservas</span> ({bookings.length})
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-24 lg:grid-cols-[58fr_42fr] lg:px-10">
        {/* Columna izquierda */}
        <div>
          <div
            onClick={() => onOpenLightbox(roomIndex)}
            className="relative h-[74vh] max-h-[760px] min-h-[520px] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-[#0B0B0D]"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={room.id}
                src={room.image}
                alt={room.label}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-[#050505]/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">
              FOTOGRAFÍA {pad(roomIndex + 1)} / {pad(cabin.rooms.length)}
            </span>

            {/* Muesca cóncava (desktop) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 rounded-l-2xl bg-[#050505] py-2.5 pl-2.5 pr-1 lg:flex"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="absolute bottom-full right-0"
                aria-hidden="true"
              >
                <path d="M20 0 V20 H0 A20 20 0 0 0 20 0 Z" fill="#050505" />
              </svg>
              {cabin.rooms.map((r, i) => renderThumb(r, i))}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="absolute right-0 top-full"
                aria-hidden="true"
              >
                <path d="M20 20 V0 H0 A20 20 0 0 1 20 20 Z" fill="#050505" />
              </svg>
            </div>
          </div>

          {/* Tira mobile */}
          <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {cabin.rooms.map((r, i) => renderThumb(r, i))}
          </div>

          <div className="mt-4 h-5 text-[13px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={room.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white">{room.label}</span>
                <span className="mx-2 text-muted">·</span>
                <span className="text-muted">{room.meta}</span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="h-[6px] w-[6px] rounded-full bg-available" />
            Vista interior · {cabin.name}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={cabin.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-white lg:text-5xl">
                <BlurText key={cabin.id} text={cabin.interiorTitle} />
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {cabin.interiorDescription}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-white/10 py-4">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Superficie
                  </dt>
                  <dd className="mt-1 text-sm text-white">{cabin.surface} m²</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Climatización
                  </dt>
                  <dd className="mt-1 text-sm text-white">{cabin.heating}</dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 text-[13px] text-muted">
            {hydrated && nights > 0
              ? `${formatShortDate(checkIn)} — ${formatShortDate(checkOut)} · ${nights} ${
                  nights === 1 ? "noche" : "noches"
                } · $${nights * cabin.pricePerNight}`
              : "Elegí tus fechas desde el exterior"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Magnet>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-[#050505] transition-colors hover:bg-white/90"
              >
                Reservar cabaña
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            </Magnet>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("equipamiento")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full border border-white/20 px-6 py-3 text-[13px] text-white transition-colors hover:bg-white/10"
            >
              Ver equipamiento
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

