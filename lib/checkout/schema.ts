import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Enter your street address"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  postalCode: z.string().trim().optional(),
  shippingZone: z.string().min(1, "Choose a shipping option"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const checkoutRequestSchema = checkoutSchema.extend({
  cartItems: z
    .array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().positive() }))
    .min(1, "Your cart is empty"),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
