"use client";

import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import { formatShortDate } from "@/lib/format";
import DrawerShell from "@/components/DrawerShell";

export default function MyBookingsDrawer() {
  const {
    isMyBookingsOpen,
    setIsMyBookingsOpen,
    bookings,
    cancelGhostBooking,
    setViewMode,
    hydrated,
  } = useBooking();
  const close = () => setIsMyBookingsOpen(false);

  return (
    <DrawerShell
      open={isMyBookingsOpen}
      onClose={close}
      title={`Mis reservas (${bookings.length})`}
      badge="Demo"
    >
      {bookings.length === 0 ? (
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
          <p className="font-display text-lg text-white">Todavía no tenés reservas</p>
          <p className="max-w-xs text-sm text-muted">
            Elegí una cabaña y tus fechas: quedarán guardadas en este navegador.
          </p>
          <button
            type="button"
            onClick={() => {
              close();
              setViewMode("exterior");
            }}
            className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-[#050505] transition-colors hover:bg-white/90"
          >
            Explorar cabañas
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((b) => {
            const cabin = getCabinById(b.cabinId);
            return (
              <li
                key={b.code}
                className="rounded-2xl border border-white/10 bg-[#121215] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.08em] text-white">
                    {b.code}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    <span className="h-[6px] w-[6px] rounded-full bg-available" />
                    Confirmada
                  </span>
                </div>
                <div className="mt-4 flex gap-4">
                  <img
                    src={cabin.exteriorImage}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-display text-white">Cabaña {cabin.name}</p>
                    <p className="mt-1 text-muted">
                      {hydrated
                        ? `${formatShortDate(b.checkIn)} — ${formatShortDate(b.checkOut)}`
                        : "—"}
                    </p>
                    <p className="text-muted">
                      {b.guests} {b.guests === 1 ? "huésped" : "huéspedes"} ·{" "}
                      <span className="text-white">${b.total}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelGhostBooking(b.code)}
                  className="mt-4 w-full rounded-full border border-white/10 py-2.5 text-xs text-muted transition-colors hover:border-white/20 hover:text-white"
                >
                  Cancelar y liberar fechas
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </DrawerShell>
  );
}
