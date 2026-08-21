import { z } from "zod";

export const addressFormSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().optional(),
  line1: z.string().trim().min(1, "Street address is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().default("Nigeria"),
  postalCode: z.string().trim().optional(),
  isDefault: z.boolean(),
});
export type AddressFormValues = z.infer<typeof addressFormSchema>;
