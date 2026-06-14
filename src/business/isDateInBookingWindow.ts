import { BOOKING_WINDOW } from "const";
export function isDateInBookingWindow(isoDateTime: string): boolean {
  const date = isoDateTime.slice(0, 10);
  return date >= BOOKING_WINDOW.from && date <= BOOKING_WINDOW.to;
}
