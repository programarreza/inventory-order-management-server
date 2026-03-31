import { z } from "zod";

const orderItemValidationSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),

  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .min(1, "Quantity must be at least 1"),
});

export const createOrderValidationSchema = z.object({
  body: z.object({
    customerName: z.string({
      message: "Customer name is required",
    }),

    items: z
      .array(orderItemValidationSchema)
      .min(1, "At least one product is required")
      .refine((items) => {
        const ids = items.map((item) => item.productId);
        return new Set(ids).size === ids.length;
      }, "Duplicate products are not allowed in the same order"),
  }),
});
