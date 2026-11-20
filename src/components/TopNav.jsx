"use client";

import { useBooking } from "@/context/BookingContext";

const LINKS = [
  { label: "Cabañas", href: "#cabanas", target: null },
  { label: "Equipamiento", href: "#equipamiento", target: "equipamiento" },
  { label: "Contacto", href: "#contacto", target: "contacto" },
];

export default function TopNav() {
  const { bookings, isMyBookingsOpen, setIsMyBookingsOpen, setViewMode, setPendingScroll } =
    useBooking();

  const go = (e, target) => {
    if (!target) return;
    e.preventDefault();
    setPendingScroll(target);
    setViewMode("interior");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-12">
      <a href="#" className="flex items-center gap-3">
        <span className="h-[6px] w-[6px] rounded-full bg-available" />
        <span className="font-display text-sm font-medium uppercase tracking-[0.32em] text-fg">
          Bruma
        </span>
      </a>

      <nav className="flex items-center gap-6 md:gap-8">
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.target)}
                className="text-[13px] text-muted transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsMyBookingsOpen(!isMyBookingsOpen)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-4 py-2 text-[13px] text-fg backdrop-blur-md transition-colors hover:bg-white/10"
        >
          <span className="h-[6px] w-[6px] rounded-full bg-available" />
          Mis reservas ({bookings.length})
        </button>
      </nav>
    </header>
  );
}
