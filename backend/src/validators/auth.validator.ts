import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1);

  export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(100, "Password must be at most 100 characters long");

export const registerSchema = z.object({
    name: z.string().trim().min(1),
    email: emailSchema,
    password: passwordSchema,
    avatar: z.string().optional(),
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>