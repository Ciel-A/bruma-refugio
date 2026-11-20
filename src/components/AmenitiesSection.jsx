"use client";

import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import { getAmenityMeta } from "@/data/amenityMeta";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export default function AmenitiesSection() {
  const { activeCabinId } = useBooking();
  const cabin = getCabinById(activeCabinId);

  return (
    <section
      id="equipamiento"
      className="mx-auto max-w-7xl scroll-mt-8 border-t border-white/10 px-6 py-20 lg:px-10"
    >
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="h-[6px] w-[6px] rounded-full bg-available" />
            Equipamiento &amp; estadía
          </p>
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-white lg:text-5xl">
            Todo lo esencial, nada de más.
          </h2>
          <p className="mt-4 text-base text-muted">
            Cada detalle de la cabaña {cabin.name} está pensado para que solo tengas que
            llegar.
          </p>
        </div>
        <div className="flex gap-10 font-mono">
          <div>
            <p className="text-3xl text-white">{cabin.surface} m²</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-muted">
              Superficie útil
            </p>
          </div>
          <div>
            <p className="text-3xl text-white">100%</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-muted">
              Aislación térmica
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cabin.amenities.map((name, i) => {
          const meta = getAmenityMeta(name);
          const Icon = meta.icon;
          return (
            <SpotlightCard
              key={`${cabin.id}-${name}`}
              className="min-h-[220px] rounded-2xl border border-white/10 bg-[#0B0B0D] p-6 transition-colors hover:border-white/25"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#111113] text-white">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-xs text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg text-white">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{meta.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-[0.08em]">
                {meta.highlight && (
                  <span className="h-[6px] w-[6px] rounded-full bg-available" />
                )}
                <span className={meta.highlight ? "text-available" : "text-muted"}>
                  {meta.tag}
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
