import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password should be atleast 6 character long" }),
});

export type LoginSchma = z.infer<typeof loginSchema>;
