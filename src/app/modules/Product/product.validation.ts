import { z } from "zod";
import { ProductStatus } from "./product.interface";

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name too long")
      .trim(),

    categoryId: z
      .string({
        required_error: "Category is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),

    price: z
      .number({
        required_error: "Price is required",
      })
      .min(0, "Price cannot be negative"),

    stock: z.number().min(0, "Stock cannot be negative").default(0),

    minStock: z.number().min(0, "Minimum stock cannot be negative").default(5),

    status: z
      .enum([ProductStatus.ACTIVE, ProductStatus.OUT_OF_STOCK])
      .optional(),

    isActive: z.boolean().optional(),
  }),
});
