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
