import { z } from "zod";

export const REQUEST_TYPE_VALUES = ["new_booking", "modify_booking", "cancel"] as const;
export const requestTypeSchema = z.enum(REQUEST_TYPE_VALUES);

export const carCategorySchema = z.enum(["economy", "compact", "suv", "van", "premium"]);

export const paymentCardSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/), // "06/28"
  cvv: z.string().regex(/^\d{3,4}$/),
  cardholderName: z.string().min(2),
});

export const incomingRequestSchema = z.object({
  customerEmail: z.email(),
  requestType: requestTypeSchema.nullable(),
  bookingRef: z.string().nullable(),
  pickupCity: z.string().nullable(),
  pickupDateAndTime: z.iso.datetime().nullable(),
  returnDateAndTime: z.iso.datetime().nullable(),
  carCategory: carCategorySchema.nullable(),
  paymentCard: paymentCardSchema.nullable(),
  additionalNotes: z.string().max(2000).default(""),
});

export type RealRequestType = z.infer<typeof requestTypeSchema>;
export type RequestType = z.infer<typeof requestTypeSchema> | null;
export type CarCategory = z.infer<typeof carCategorySchema> | null;
export type PaymentCard = z.infer<typeof paymentCardSchema> | null;
export type IncomingRequest = z.infer<typeof incomingRequestSchema>;
