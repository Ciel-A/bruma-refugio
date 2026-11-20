"use client";

import DecryptedText from "@/components/reactbits/DecryptedText";

export default function InteriorDetailGallery({ cabin, onOpen }) {
  const [a, b] = cabin.detailGallery;
  const offset = cabin.rooms.length;

  const renderPhoto = (photo, i, span) => (
    <button
      type="button"
      key={photo.id}
      onClick={() => onOpen(offset + i)}
      className={`group relative h-[380px] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-card lg:h-[440px] ${span}`}
    >
      <img
        src={photo.image}
        alt={photo.label}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </button>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="mb-5 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40">
        <span>Detalles del espacio</span>
        <DecryptedText key={cabin.id} text={cabin.coordinates} trigger="inView" className="font-mono" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {renderPhoto(a, 0, "md:col-span-7")}
        {renderPhoto(b, 1, "md:col-span-5")}
      </div>
    </section>
  );
}

