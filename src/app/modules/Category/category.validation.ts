import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must be at most 30 characters long"),

    description: z.string().optional(),
  }),
});

export { createCategoryValidationSchema };
