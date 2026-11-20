"use client";

import { useState } from "react";
import { Check, AlertCircle, ArrowRight, ArrowUpRight } from "lucide-react";
import DecryptedText from "@/components/reactbits/DecryptedText";
import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import { formatShortDate } from "@/lib/format";
import { bookingMessage, nightsBetween, waLink } from "@/lib/booking";
import DrawerShell from "@/components/DrawerShell";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30";

export default function BookingDrawer() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    activeCabinId,
    checkIn,
    checkOut,
    guests,
    hasConflict,
    createGhostBooking,
    cancelGhostBooking,
    setViewMode,
    hydrated,
  } = useBooking();
  const cabin = getCabinById(activeCabinId);

  const [form, setForm] = useState({ guestName: "", guestEmail: "", notes: "" });
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [prevOpen, setPrevOpen] = useState(false);

  // Al abrir el drawer: estado limpio
  if (isDrawerOpen !== prevOpen) {
    setPrevOpen(isDrawerOpen);
    if (isDrawerOpen) {
      setReceipt(null);
      setError("");
    }
  }

  const close = () => setIsDrawerOpen(false);
  const nights = nightsBetween(checkIn, checkOut);
  const total = nights * cabin.pricePerNight;
  const conflict = hydrated && hasConflict(cabin.id, checkIn, checkOut);
  const invalidRange = nights <= 0;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.guestName.trim()) return setError("Ingresá tu nombre y apellido.");
    if (!/^\S+@\S+\.\S+$/.test(form.guestEmail.trim()))
      return setError("Ingresá un email válido.");
    const res = createGhostBooking(form);
    if (!res.ok) return setError(res.error);
    setReceipt(res.booking);
    setForm({ guestName: "", guestEmail: "", notes: "" });
  };

  const backToCalendar = () => {
    close();
    setViewMode("exterior");
  };

  return (
    <DrawerShell
      open={isDrawerOpen}
      onClose={close}
      title={receipt ? "Reserva registrada" : "Completar reserva"}
      badge="Reserva demo"
    >
      {receipt ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-available/40 bg-available/10 text-available">
              <Check size={20} strokeWidth={1.75} />
            </span>
            <span className="rounded-full border border-white/10 bg-[#121215] px-3 py-1 font-mono text-xs tracking-[0.08em] text-white">
              <DecryptedText text={receipt.code} />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              Tus fechas quedaron bloqueadas automáticamente en el calendario de esta sesión.
            </p>
          </div>

          <dl className="space-y-3 rounded-2xl border border-white/10 bg-[#121215] p-4 text-sm">
            {[
              ["Cabaña", receipt.cabinId === cabin.id ? cabin.name : getCabinById(receipt.cabinId).name],
              ["Fechas", `${formatShortDate(receipt.checkIn)} — ${formatShortDate(receipt.checkOut)}`],
              ["Noches", receipt.nights],
              ["Huéspedes", receipt.guests],
              ["A nombre de", receipt.guestName],
              ["Total", `$${receipt.total}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right text-white">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={close}
              className="w-full rounded-full bg-white py-3.5 font-medium text-[#050505] transition-colors hover:bg-white/90"
            >
              Volver al refugio
            </button>
            <a
              href={waLink(bookingMessage(receipt, getCabinById(receipt.cabinId)))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              Enviar resumen por WhatsApp
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={() => {
                cancelGhostBooking(receipt.code);
                setReceipt(null);
              }}
              className="py-2 text-xs text-muted underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Cancelar reserva y liberar fechas
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
          <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#121215] p-4">
            <img
              src={cabin.exteriorImage}
              alt=""
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-display text-base text-white">Cabaña {cabin.name}</p>
              <p className="mt-1 text-muted">
                {hydrated ? `${formatShortDate(checkIn)} — ${formatShortDate(checkOut)}` : "—"}
              </p>
              <p className="text-muted">
                {nights} {nights === 1 ? "noche" : "noches"} · {guests}{" "}
                {guests === 1 ? "huésped" : "huéspedes"}
              </p>
              <p className="mt-2 font-mono text-xs text-white">
                ${cabin.pricePerNight} × {nights} {nights === 1 ? "noche" : "noches"} = ${total}
              </p>
            </div>
          </div>

          {(conflict || invalidRange) && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <div className="flex flex-col items-start gap-2">
                <span>
                  {conflict
                    ? "Esas fechas ya están reservadas en esta cabaña."
                    : "Elegí un rango de fechas válido para continuar."}
                </span>
                <button
                  type="button"
                  onClick={backToCalendar}
                  className="underline underline-offset-4 hover:text-red-200"
                >
                  Volver al calendario
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-xs text-muted">
              Nombre y apellido
              <input
                className={inputCls}
                value={form.guestName}
                onChange={set("guestName")}
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-muted">
              Email de confirmación
              <input
                className={inputCls}
                type="email"
                value={form.guestEmail}
                onChange={set("guestEmail")}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-muted">
              Notas opcionales (horario estimado de llegada)
              <textarea
                className={`${inputCls} min-h-24 resize-none`}
                value={form.notes}
                onChange={set("notes")}
                placeholder="Llegamos alrededor de las 18:00"
              />
            </label>
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={conflict || invalidRange}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 font-medium text-[#050505] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirmar reserva
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </form>
      )}
    </DrawerShell>
  );
}
