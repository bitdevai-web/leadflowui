import { BrevoEvent } from "../types/types";
import { z } from "zod";

export const emailFilterSchema = z.object({
  status: z
    .enum([
      BrevoEvent.SENT,
      BrevoEvent.DELIVERED,
      BrevoEvent.UNIQUE_OPENED,
      BrevoEvent.OPENED,
      BrevoEvent.PROXY_OPEN,
      BrevoEvent.CLICKED,
      BrevoEvent.SOFT_BOUNCE,
      BrevoEvent.HARD_BOUNCE,
      BrevoEvent.INVALID_EMAIL,
      BrevoEvent.ERROR,
      BrevoEvent.DEFERRED,
      BrevoEvent.SPAM,
      BrevoEvent.UNSUBSCRIBED,
      BrevoEvent.BLOCKED,
      BrevoEvent.SCHEDULED,
      BrevoEvent.SENT_TO_BREVO,
    ])
    .or(z.literal("")),
  lead_id: z.string().optional(),
  sender_id: z.string().optional(),
});
export type IEmailFilter = z.infer<typeof emailFilterSchema>;

export const emailInboxFilterSchema = z.object({
  from_: z.string(),
  reply_for_id: z.string(),
});
export type IEmailInboxFilter = z.infer<typeof emailInboxFilterSchema>;
