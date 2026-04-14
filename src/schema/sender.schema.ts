import { z } from "zod";

export const senderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  ending: z.string().min(1, "Ending is required"),
  designation: z.string().min(1, "Designation is required"),
});

export type ISenderSchema = z.infer<typeof senderSchema>;
