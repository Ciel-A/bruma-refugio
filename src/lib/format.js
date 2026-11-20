import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const cap = (s) =>
  s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// "2026-11-27" -> "Vie 27 Nov"
export function formatShortDate(iso) {
  if (!iso) return "—";
  return cap(format(parseISO(iso), "EEE d MMM", { locale: es }).replace(/\./g, ""));
}

export function formatMonthTitle(date) {
  return cap(format(date, "LLLL yyyy", { locale: es }));
}
