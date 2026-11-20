import { differenceInCalendarDays, parseISO } from "date-fns";
import { formatShortDate } from "@/lib/format";

export const WHATSAPP_NUMBER = "5492944000000";

export function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)));
}

export function inquiryMessage({ cabin, checkIn, checkOut, guests }) {
  return `Hola BRUMA, quisiera consultar por la Cabaña ${cabin.name} del ${formatShortDate(
    checkIn
  )} al ${formatShortDate(checkOut)} para ${guests} ${guests === 1 ? "huésped" : "huéspedes"}.`;
}

export function bookingMessage(booking, cabin) {
  return `Hola BRUMA, registré la reserva ${booking.code} para la Cabaña ${cabin.name} del ${formatShortDate(
    booking.checkIn
  )} al ${formatShortDate(booking.checkOut)} (${booking.nights} noches, ${booking.guests} huéspedes, total $${booking.total}). A nombre de ${booking.guestName}.`;
}
