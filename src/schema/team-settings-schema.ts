import { z } from "zod";

export const teamSettingsSchema = z.object({
  exampleString: z.string().min(1),
  exampleSecret: z.string().min(1),
  exampleBoolean: z.boolean(),
  exampleNumber: z.number(),
});
