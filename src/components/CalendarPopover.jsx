"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import { formatMonthTitle } from "@/lib/format";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const iso = (d) => format(d, "yyyy-MM-dd");

export default function CalendarPopover({ onClose }) {
  const {
    activeCabinId,
    checkIn,
    checkOut,
    setDates,
    getBlockedDates,
    hasConflict,
    bookings,
  } = useBooking();
  const cabin = getCabinById(activeCabinId);
  const ref = useRef(null);

  const [start, setStart] = useState(checkIn || null);
  const [end, setEnd] = useState(checkOut || null);
  const [month, setMonth] = useState(() =>
    startOfMonth(checkIn ? parseISO(checkIn) : new Date())
  );
  const [hover, setHover] = useState(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  // `bookings` en deps para recalcular al reservar/cancelar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blocked = useMemo(() => new Set(getBlockedDates(activeCabinId)), [activeCabinId, bookings]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  const days = useMemo(() => {
    const first = startOfMonth(month);
    const lead = (first.getDay() + 6) % 7; // semana arranca en lunes
    const cells = Array(lead).fill(null);
    eachDayOfInterval({ start: first, end: endOfMonth(month) }).forEach((d) => cells.push(d));
    return cells;
  }, [month]);

  const conflict = start && end ? hasConflict(activeCabinId, start, end) : false;
  const nights = start && end ? differenceInCalendarDays(parseISO(end), parseISO(start)) : 0;
  const canConfirm = start && end && nights > 0 && !conflict;

  const pick = (d) => {
    const s = iso(d);
    if (!start || end) {
      setStart(s);
      setEnd(null);
    } else if (s <= start) {
      setStart(s);
    } else {
      setEnd(s);
    }
  };

  const confirm = () => {
    if (!canConfirm) return;
    setDates(start, end);
    onClose();
  };

  const canGoPrev = !isBefore(subMonths(month, 1), startOfMonth(today));

  // Rango de previsualización mientras se elige la salida
  const previewEnd = start && !end && hover && hover > start ? hover : null;
  const rangeEnd = end || previewEnd;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-full left-1/2 z-30 mb-4 max-h-[75dvh] w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-white/12 bg-[#0D0D0F]/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          disabled={!canGoPrev}
          onClick={() => setMonth(subMonths(month, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="font-display text-sm text-white">{formatMonthTitle(month)}</span>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => setMonth(addMonths(month, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 font-mono text-[10px] uppercase text-muted">
            {w}
          </span>
        ))}
        {days.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const s = iso(d);
          const past = isBefore(d, today);
          const isBlocked = blocked.has(s);
          const disabled = past || isBlocked;
          const isEdge = s === start || s === end;
          const inRange = start && rangeEnd && s > start && s < rangeEnd;
          const bridge = inRange || (s === start && rangeEnd) || (s === rangeEnd && start);
          return (
            <div
              key={s}
              className={`flex justify-center py-0.5 ${
                bridge && !(s === start && s === rangeEnd)
                  ? inRange
                    ? "bg-white/10"
                    : s === start
                      ? "rounded-l-full bg-white/10"
                      : "rounded-r-full bg-white/10"
                  : ""
              }`}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => pick(d)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                aria-label={format(d, "d 'de' MMMM", {})}
                className={`h-8 w-8 rounded-full text-xs transition-colors ${
                  isBlocked
                    ? "cursor-not-allowed text-muted line-through opacity-30"
                    : past
                      ? "cursor-not-allowed text-muted opacity-30"
                      : isEdge
                        ? "bg-white font-medium text-[#050505]"
                        : "text-white hover:bg-white/10"
                }`}
              >
                {format(d, "d")}
              </button>
            </div>
          );
        })}
      </div>

      {conflict && (
        <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-muted">
          Ese rango incluye fechas reservadas en {cabin.name}. Elegí otro.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
        <span className="font-mono uppercase tracking-[0.08em] text-muted">
          — Fechas reservadas
        </span>
        <span className="text-white">
          {nights > 0 && !conflict
            ? `${nights} ${nights === 1 ? "noche" : "noches"} · $${nights * cabin.pricePerNight} total`
            : "Elegí tus fechas"}
        </span>
      </div>

      <button
        type="button"
        onClick={confirm}
        disabled={!canConfirm}
        className="mt-3 w-full rounded-full bg-white py-2.5 text-[13px] font-medium text-[#050505] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Confirmar fechas
      </button>
    </motion.div>
  );
}
