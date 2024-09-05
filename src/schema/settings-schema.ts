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

export const CommonDataSourceSchema = z.object({
  name: z.string().min(1),
  prefix: z
    .string()
    .min(1)
    .regex(
      /^$|^[A-Z][A-Za-z0-9_]*$/,
      "Must start with an uppercase letter and only consist of alphanumeric characters and underscores"
    ),
});
export type CommonDataSourceSchema = z.infer<typeof CommonDataSourceSchema>;

export function makeConnectSettings(zod: typeof z) {
  return zod.object({
    numberOfMockItems: zod.number(),
  });
}

export const ConnectSettings = makeConnectSettings(z);
export type ConnectSettings = z.infer<typeof ConnectSettings>;
