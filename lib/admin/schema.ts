import { z } from "zod";

export const STANDARD_SIZES = ["100g", "250g", "500g", "1kg", "5kg", "25kg"] as const;

export const variantFormSchema = z.object({
  id: z.string().uuid().optional(), // present = update existing row, absent = insert
  sizeLabel: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  lowStockThreshold: z.coerce.number().int().min(0).default(10),
  sku: z.string().min(1, "SKU is required"),
});
export type VariantFormValues = z.infer<typeof variantFormSchema>;

export const productFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(10, "Add a short description"),
  status: z.enum(["draft", "published", "archived"]),
  isPetSafe: z.boolean(),
  petSafeNote: z.string().trim().optional(),
  variants: z.array(variantFormSchema).min(1, "Add at least one size"),
  facetIds: z.array(z.string().uuid()),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

export const facetTypeSchema = z.enum(["type", "origin", "use_case"]);

export const orderStatusSchema = z.enum(["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]);

export const manualOrderLineItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Price must be 0 or more"),
});

export const manualOrderFormSchema = z.object({
  lineItems: z.array(manualOrderLineItemSchema).min(1, "Add at least one item"),
  customerName: z.string().trim().min(2, "Customer name is required"),
  customerPhone: z.string().trim().min(5, "Phone number is required"),
  paymentMethod: z.string().trim().min(2, "Add a payment method note"),
  shipping: z
    .object({
      line1: z.string().trim().min(1),
      line2: z.string().trim().optional(),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      country: z.string().trim().default("Nigeria"),
      postalCode: z.string().trim().optional(),
    })
    .optional(),
});
export type ManualOrderFormValues = z.infer<typeof manualOrderFormSchema>;

export const shippingRuleFormSchema = z.object({
  id: z.string().uuid().optional(),
  zoneName: z.string().trim().min(2, "Zone name is required"),
  rate: z.coerce.number().min(0, "Rate must be 0 or more"),
});
export type ShippingRuleFormValues = z.infer<typeof shippingRuleFormSchema>;

export const taxRuleFormSchema = z.object({
  id: z.string().uuid().optional(),
  region: z.string().trim().min(2, "Region is required"),
  ratePercent: z.coerce.number().min(0, "Rate must be 0 or more"),
});
export type TaxRuleFormValues = z.infer<typeof taxRuleFormSchema>;

export const siteContentFormSchema = z.object({
  key: z.enum(["disclaimer", "returns_policy", "privacy_policy", "terms"]),
  bodyRichtext: z.string(),
});
export type SiteContentFormValues = z.infer<typeof siteContentFormSchema>;

export const storeSettingsFormSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),
  whatsappNumber: z.string().trim().optional(),
  contactEmail: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  notifyOnNewOrder: z.boolean(),
  notifyOnLowStock: z.boolean(),
});
export type StoreSettingsFormValues = z.infer<typeof storeSettingsFormSchema>;

export const blogPostFormSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(2, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  bodyRichtext: z.string(),
  coverImagePath: z.string().nullable(),
  status: z.enum(["draft", "published"]),
  relatedProductIds: z.array(z.string().uuid()),
});
export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
