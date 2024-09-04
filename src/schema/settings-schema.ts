import { z } from "zod";

export const TeamSettings = z.object({
  accountSetting: z.string(),
  someSecret: z.string(),
});
export type TeamSettings = z.infer<typeof TeamSettings>;

export const SafeTeamSettings = TeamSettings.pick({ accountSetting: true });

export const SiteSettings = z.object({
  enabled: z.boolean(),
  siteSetting: z.string(),
});
export type SiteSettings = z.infer<typeof SiteSettings>;