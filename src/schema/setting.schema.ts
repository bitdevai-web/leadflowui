import { z } from "zod";

export const settingUpdateSchema = z.object({
  value: z.string(),
  description: z.string().nullable().optional(),
});

export type ISettingUpdateSchema = z.infer<typeof settingUpdateSchema>;
