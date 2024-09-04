import { TRPCError } from "@trpc/server";
import { procedure, router } from "./trpc";
import {
  SafeTeamSettings,
  SiteSettings,
  TeamSettings,
} from "../schema/settings-schema";
import { NetlifyExtensionClient } from "@netlify/sdk";

export const appRouter = router({
  readAccount: procedure.query(async ({ ctx: { teamId, client: c } }) => {
    try {
      const client = c as ShowcaseNetlifyClient;
      if (!teamId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "teamId is required",
        });
      }
      return (await client.getTeamConfiguration(teamId))?.config.accountSetting;
    } catch (e) {
      throw maskInternalErrors(e as Error);
    }
  }),

  teamSettings: {
    read: procedure.query(async ({ ctx: { teamId, client: c } }) => {
      try {
        const client = c as ShowcaseNetlifyClient;
        if (!teamId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "teamId is required",
          });
        }
        const config = (await client.getTeamConfiguration(teamId))?.config;
        if (!config) {
          return;
        }
        return SafeTeamSettings.parse(config);
      } catch (e) {
        throw maskInternalErrors(e as Error);
      }
    }),
    update: procedure
      .input(SafeTeamSettings.strict())
      .mutation(async ({ ctx: { teamId, client: c }, input }) => {
        try {
          const client = c as ShowcaseNetlifyClient;
          if (!teamId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "teamId is required",
            });
          }
          const config = (await client.getTeamConfiguration(teamId))?.config;
          const newConfig = {
            someSecret: "SECRET!!!",
            ...config,
            ...input,
          };
          if (config) {
            await client.updateTeamConfiguration(teamId, newConfig);
          } else {
            await client.createTeamConfiguration(teamId, newConfig);
          }
        } catch (e) {
          throw maskInternalErrors(e as Error);
        }
      }),
  },
});

export type AppRouter = typeof appRouter;

function maskInternalErrors(e: Error) {
  if (e instanceof TRPCError) {
    return e;
  }
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    cause: e,
  });
}

export type ShowcaseNetlifyClient = NetlifyExtensionClient<
  SiteSettings,
  TeamSettings,
  unknown
>;
