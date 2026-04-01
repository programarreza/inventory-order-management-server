import { z } from "zod";

export const createRestockValidationSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),

    currentStock: z.number().min(0, "Stock cannot be negative"),

    minStock: z.number().min(0, "Minimum stock cannot be negative"),
  }),
});

export const updateRestockValidationSchema = z.object({
  body: z.object({
    isResolved: z.boolean().optional(),

    currentStock: z.number().min(0).optional(),
  }),
});
