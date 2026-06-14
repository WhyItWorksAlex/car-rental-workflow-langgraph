import bookedAvailability from "data/bookedAvailability.json";
import type { CarCategory } from "schemas/incomingRequest";

type AvailabilitySlot = { from: string; to: string };
type AvailableSlotsByCategory = Record<string, AvailabilitySlot[]>;

export function hasFreeSlots(carCategory: CarCategory, pickupDateAndTime: string, returnDateAndTime: string): boolean {
  if (carCategory == null) return false;
  const requestFrom = pickupDateAndTime.slice(0, 10);
  const requestTo = returnDateAndTime.slice(0, 10);
  const freeSlots = (bookedAvailability as AvailableSlotsByCategory)[carCategory] ?? [];
  // there is not free slots for such category
  if (freeSlots.length === 0) return false;
  const fitsAtLeastOneFreeSlot = freeSlots.some((slot) => requestFrom >= slot.from && requestTo <= slot.to);
  return fitsAtLeastOneFreeSlot;
}
