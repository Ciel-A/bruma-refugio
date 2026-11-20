import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 font-mono text-xs text-white/40 md:flex-row">
        <span>BRUMA © 2026</span>
        <span className="text-center">
          DEMO INTERACTIVA · RESERVAS SIMULADAS EN NAVEGADOR
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            Instagram
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </a>
          <a
            href="mailto:hola@brumarefugio.com"
            className="transition-colors hover:text-white"
          >
            hola@brumarefugio.com
          </a>
        </div>
      </div>
    </footer>
  );
}
