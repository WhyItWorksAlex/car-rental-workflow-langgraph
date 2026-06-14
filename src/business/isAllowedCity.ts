import { ALLOWED_CITIES } from "../const";

export function isAllowedCity(city: string | null): boolean {
  if (city == null) return false;
  return (ALLOWED_CITIES as readonly string[]).includes(city);
}
