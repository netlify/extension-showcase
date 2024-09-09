import { TRPCError } from "@trpc/server";
import { procedure, router } from "./trpc";
import {
  CommonDataSourceSchema,
  ConnectSettings,
  SafeTeamSettings,
  SiteSettings,
  TeamSettings,
} from "../schema/settings-schema";
import { NetlifyExtensionClient, z } from "@netlify/sdk";

export const appRouter = router({
  readAccountSetting: procedure.query(
    async ({ ctx: { teamId, client: c } }) => {
      try {
        const client = c as ShowcaseNetlifyClient;
        if (!teamId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "teamId is required",
          });
        }
        return (await client.getTeamConfiguration(teamId))?.config
          .accountSetting;
      } catch (e) {
        throw maskInternalErrors(e as Error);
      }
    }
  ),

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

  siteSettings: {
    read: procedure.query(async ({ ctx: { teamId, siteId, client: c } }) => {
      try {
        const client = c as ShowcaseNetlifyClient;
        if (!teamId || !siteId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "teamId and siteId and required",
          });
        }
        return (await client.getSiteConfiguration(teamId, siteId))?.config;
      } catch (e) {
        throw maskInternalErrors(e as Error);
      }
    }),
    update: procedure
      .input(SiteSettings.strict())
      .mutation(async ({ ctx: { teamId, siteId, client: c }, input }) => {
        try {
          const client = c as ShowcaseNetlifyClient;
          if (!teamId || !siteId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "teamId and siteId and required",
            });
          }
          const config = (await client.getSiteConfiguration(teamId, siteId))
            ?.config;
          const newConfig = {
            ...config,
            ...input,
          };
          if (config) {
            await client.updateSiteConfiguration(teamId, siteId, newConfig);
          } else {
            await client.createSiteConfiguration(teamId, siteId, newConfig);
          }
          await client.createOrUpdateVariables({
            accountId: teamId,
            siteId,
            variables: {
              SHOWCASE_ENABLED: newConfig.enabled ? "1" : "0",
            },
          });
        } catch (e) {
          throw maskInternalErrors(e as Error);
        }
      }),
  },

  connectSettings: {
    read: procedure
      .input(
        z.object({
          dataLayerId: z.string(),
          configurationId: z.string().optional(),
        })
      )
      .query(
        async ({
          ctx: { teamId, client: c },
          input: { dataLayerId, configurationId },
        }) => {
          try {
            if (!configurationId) {
              return;
            }
            const client = c as ShowcaseNetlifyClient;
            if (!teamId) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "teamId is required",
              });
            }
            const config = (
              await client.getConnectConfiguration({
                teamId,
                dataLayerId,
                configurationId,
              })
            );
            if (!config) {
              return;
            }
            return {
              name: config.name,
              prefix: config.prefix,
              config: config.config,
            };
          } catch (e) {
            throw maskInternalErrors(e as Error);
          }
        }
      ),
    upsert: procedure
      .input(
        z.object({
          dataLayerId: z.string(),
          configurationId: z.string().optional(),
          config: ConnectSettings,
        }).merge(CommonDataSourceSchema)
      )
      .mutation(
        async ({
          ctx: { teamId, client: c },
          input: { dataLayerId, configurationId, name, prefix, config },
        }) => {
          try {
            const client = c as ShowcaseNetlifyClient;
            if (!teamId) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "teamId is required",
              });
            }
            if (configurationId && configurationId !== "") {
              await client.updateConnectConfiguration({
                teamId,
                dataLayerId,
                configurationId,
                name,
                prefix,
                config,
              });
            } else {
              await client.createConnectConfiguration({
                teamId,
                dataLayerId,
                name,
                prefix,
                config,
              });
            }
          } catch (e) {
            throw maskInternalErrors(e as Error);
          }
        }
      ),
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
  ConnectSettings
>;
