"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import { formatShortDate } from "@/lib/format";
import { inquiryMessage, waLink } from "@/lib/booking";

const EMAIL = "hola@brumarefugio.com";
const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30";

export default function ContactSection() {
  const { activeCabinId, checkIn, checkOut, guests, hydrated } = useBooking();
  const cabin = getCabinById(activeCabinId);

  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard no disponible */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Ingresá tu nombre y apellido.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Ingresá un email válido.");
    setError("");
    setSent(true);
  };

  const dates = hydrated ? `${formatShortDate(checkIn)}–${formatShortDate(checkOut)}` : "—";

  const rows = [
    { label: "Ubicación", value: "Villa La Angostura, Patagonia · Ruta 40 km 2118" },
    {
      label: "Tiempo de respuesta",
      value: (
        <span className="flex items-center gap-2">
          <span className="h-[6px] w-[6px] rounded-full bg-available" />
          Menos de 2 horas en horario diurno
        </span>
      ),
    },
  ];

  return (
    <section
      id="contacto"
      className="mx-auto grid max-w-7xl scroll-mt-8 grid-cols-1 gap-12 border-t border-white/10 px-6 py-24 lg:grid-cols-12 lg:px-10"
    >
      <div className="lg:col-span-5">
        <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="h-[6px] w-[6px] rounded-full bg-available" />
          Atención personalizada
        </p>
        <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-white lg:text-5xl">
          Hablemos antes de tu llegada.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Te ayudamos con traslados, actividades y cualquier requerimiento especial para tu
          estadía.
        </p>

        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {rows.map((r) => (
            <div key={r.label} className="py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                {r.label}
              </p>
              <div className="mt-1 text-sm text-white">{r.value}</div>
            </div>
          ))}
          <div className="py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Email prioritario
            </p>
            <div className="mt-1 flex items-center justify-between gap-3 text-sm text-white">
              <span>{EMAIL}</span>
              <button
                type="button"
                onClick={copy}
                aria-label="Copiar email"
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:border-white/20 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-available" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <a
          href={waLink(inquiryMessage({ cabin, checkIn, checkOut, guests }))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] text-white transition-colors hover:bg-white/10"
        >
          Escribir por WhatsApp
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </a>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-3xl border border-white/10 bg-[#0B0B0D] p-6 sm:p-8">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111113] px-3 py-1.5 text-xs text-white">
            <span className="h-[6px] w-[6px] rounded-full bg-available" />
            Consulta: Cabaña {cabin.name} · {dates} · {guests}{" "}
            {guests === 1 ? "huésped" : "huéspedes"}
          </p>

          {sent ? (
            <div className="flex min-h-[320px] flex-col items-start justify-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-available/40 bg-available/10 text-available">
                <Check size={20} strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-2xl text-white">Consulta enviada</h3>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Gracias, {form.name.split(" ")[0]}. Te vamos a responder a {form.email} en menos de
                2 horas en horario diurno. (Demo: no se envió ningún mensaje real.)
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-2 rounded-full border border-white/20 px-6 py-3 text-[13px] text-white transition-colors hover:bg-white/10"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
              <label className="flex flex-col gap-2 text-xs text-muted">
                Nombre y apellido
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs text-muted">
                Email de contacto
                <input
                  className={inputCls}
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs text-muted">
                Mensaje o requerimientos especiales (opcional)
                <textarea
                  className={`${inputCls} min-h-32 resize-none`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Contanos qué necesitás"
                />
              </label>
              {error && <p className="text-xs text-red-300">{error}</p>}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 font-medium text-[#050505] transition-colors hover:bg-white/90"
              >
                Enviar consulta
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
