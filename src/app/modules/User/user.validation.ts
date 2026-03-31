import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must be at most 30 characters long"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),
    contactNo: z.string({
      required_error: "Contact number is required",
    }),
    role: z.string().optional(),
    address: z.string().optional(),
  }),
});

export { createUserValidationSchema };
