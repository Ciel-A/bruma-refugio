import { Space_Grotesk, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "BRUMA — Refugio de cabañas en Patagonia",
  description:
    "Tres cabañas de madera oscura entre el bosque y la niebla. Reservas boutique en la Patagonia.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden bg-bg text-fg antialiased">
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
