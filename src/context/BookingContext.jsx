"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { addDays, eachDayOfInterval, format, parseISO } from "date-fns";
import { CABINS } from "@/data/cabinsData";

export const STORAGE_KEY = "bruma_ghost_bookings_v1";
const DATE_FMT = "yyyy-MM-dd";
const fmt = (d) => format(d, DATE_FMT);

/* ---------- Helpers puros (operan sobre una lista de reservas) ---------- */

// Noches ocupadas de una reserva: [checkIn, checkOut) — el día de salida queda libre.
function nightsOf(booking) {
  const start = parseISO(booking.checkIn);
  const end = parseISO(booking.checkOut);
  if (end <= start) return [];
  return eachDayOfInterval({ start, end: addDays(end, -1) }).map(fmt);
}

export function getBlockedDates(bookings, cabinId) {
  const set = new Set();
  bookings
    .filter((b) => b.cabinId === cabinId && b.status !== "cancelled")
    .forEach((b) => nightsOf(b).forEach((d) => set.add(d)));
  return [...set].sort();
}

export function hasConflict(bookings, cabinId, startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = typeof startDate === "string" ? startDate : fmt(startDate);
  const end = typeof endDate === "string" ? endDate : fmt(endDate);
  const blocked = new Set(getBlockedDates(bookings, cabinId));
  return nightsOf({ checkIn: start, checkOut: end }).some((d) => blocked.has(d));
}

function generateCode(existing) {
  const used = new Set(existing.map((b) => b.code));
  let code;
  do {
    code = `#BRM-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (used.has(code));
  return code;
}

/* ---------- Estado inicial determinístico (sin hydration mismatch) ---------- */

function buildDefaults() {
  const today = new Date();
  return {
    activeCabinId: "helecho",
    viewMode: "exterior",
    checkIn: fmt(addDays(today, 3)),
    checkOut: fmt(addDays(today, 6)),
    guests: 2,
    bookings: [
      {
        code: "#BRM-4821",
        cabinId: "helecho",
        guestName: "Reserva de ejemplo",
        guestEmail: "ejemplo@bruma.com",
        notes: "Reserva fantasma precargada",
        checkIn: fmt(addDays(today, 10)),
        checkOut: fmt(addDays(today, 13)),
        guests: 2,
        nights: 3,
        total: 240 * 3,
        status: "confirmed",
        createdAt: today.toISOString(),
      },
    ],
  };
}

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, setState] = useState(buildDefaults);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hidratar desde localStorage (solo cliente)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      /* storage corrupto: se usan defaults */
    }
    setHydrated(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* cuota / modo privado */
    }
  }, [state, hydrated]);

  // Sincronizar entre pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setState((prev) => ({ ...prev, ...JSON.parse(e.newValue) }));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const patch = useCallback((p) => setState((prev) => ({ ...prev, ...p })), []);

  const setActiveCabinId = useCallback(
    (id) => {
      if (CABINS.some((c) => c.id === id)) patch({ activeCabinId: id });
    },
    [patch]
  );
  const setViewMode = useCallback(
    (mode) => {
      if (mode === "exterior" || mode === "interior") patch({ viewMode: mode });
    },
    [patch]
  );
  const toggleViewMode = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        viewMode: prev.viewMode === "exterior" ? "interior" : "exterior",
      })),
    []
  );
  const setCheckIn = useCallback((d) => patch({ checkIn: d }), [patch]);
  const setCheckOut = useCallback((d) => patch({ checkOut: d }), [patch]);
  const setDates = useCallback(
    (checkIn, checkOut) => patch({ checkIn, checkOut }),
    [patch]
  );
  const setGuests = useCallback((g) => patch({ guests: Math.max(1, g) }), [patch]);

  const getBlocked = useCallback(
    (cabinId) => getBlockedDates(stateRef.current.bookings, cabinId),
    []
  );
  const checkConflict = useCallback(
    (cabinId, startDate, endDate) =>
      hasConflict(stateRef.current.bookings, cabinId, startDate, endDate),
    []
  );

  const createGhostBooking = useCallback(({ guestName, guestEmail, notes = "" }) => {
    const s = stateRef.current;
    const cabin = CABINS.find((c) => c.id === s.activeCabinId);
    if (!cabin) return { ok: false, error: "Cabaña inexistente." };
    if (!guestName?.trim() || !guestEmail?.trim())
      return { ok: false, error: "Completá nombre y email." };
    if (!s.checkIn || !s.checkOut || parseISO(s.checkOut) <= parseISO(s.checkIn))
      return { ok: false, error: "Elegí un rango de fechas válido." };
    if (s.guests > cabin.maxGuests)
      return { ok: false, error: `Máximo ${cabin.maxGuests} huéspedes.` };
    if (hasConflict(s.bookings, cabin.id, s.checkIn, s.checkOut))
      return { ok: false, error: "Esas fechas ya no están disponibles." };

    const nights = nightsOf({ checkIn: s.checkIn, checkOut: s.checkOut }).length;
    const booking = {
      code: generateCode(s.bookings),
      cabinId: cabin.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      notes: notes.trim(),
      checkIn: s.checkIn,
      checkOut: s.checkOut,
      guests: s.guests,
      nights,
      total: nights * cabin.pricePerNight,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    // Actualiza ref de inmediato para evitar dobles reservas en el mismo tick
    const next = { ...s, bookings: [...s.bookings, booking] };
    stateRef.current = next;
    setState(next);
    return { ok: true, booking };
  }, []);

  const cancelGhostBooking = useCallback((bookingCode) => {
    const s = stateRef.current;
    if (!s.bookings.some((b) => b.code === bookingCode)) return false;
    const next = { ...s, bookings: s.bookings.filter((b) => b.code !== bookingCode) };
    stateRef.current = next;
    setState(next);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      isDrawerOpen,
      isMyBookingsOpen,
      setIsDrawerOpen,
      setIsMyBookingsOpen,
      pendingScroll,
      setPendingScroll,
      setActiveCabinId,
      setViewMode,
      toggleViewMode,
      setCheckIn,
      setCheckOut,
      setDates,
      setGuests,
      getBlockedDates: getBlocked,
      hasConflict: checkConflict,
      createGhostBooking,
      cancelGhostBooking,
    }),
    [
      state,
      hydrated,
      isDrawerOpen,
      isMyBookingsOpen,
      pendingScroll,
      setActiveCabinId,
      setViewMode,
      toggleViewMode,
      setCheckIn,
      setCheckOut,
      setDates,
      setGuests,
      getBlocked,
      checkConflict,
      createGhostBooking,
      cancelGhostBooking,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de <BookingProvider>");
  return ctx;
}
