import { z } from "zod";

export const leadFilterSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  email_verified: z.string(),
  category: z.string(),
  designation: z.string(),
  company: z.string(),
  country: z.string(),
  created_at: z.string(),
  is_sent: z.boolean().optional(),
  is_responded: z.boolean().optional(),
  search: z.string().optional(),
});

export type LeadFilterSchema = z.infer<typeof leadFilterSchema>;

export const leadGenerateSchema = z.object({
  country: z.string().min(1, { message: "Please Select a country" }),
  industry: z.string().min(1, { message: "Please Select a Industry" }),
  title: z.string().min(1, { message: "Please Select a Designation" }),
});

export type LeadGenerationSchema = z.infer<typeof leadGenerateSchema>;

export const emailScheduleSchema = z.object({
  lead_id: z.string(),
  sender_id: z.coerce.number({ message: "Please select a sender" }).min(1, {
    message: "Please select a sender",
  }),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  scheduled_time_min: z.string().time({ message: "Please Enter a Valid Time" }),
  scheduled_time_max: z.string().time({ message: "Please Enter a Valid Time" }),
  current_index: z.number(),
});
