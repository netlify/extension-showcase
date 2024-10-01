import { useNetlifySDK } from "@netlify/sdk/ui/react";
import {
  Card,
  CardLoader,
  CardTitle,
  Checkbox,
  Form,
  FormField,
  Link,
  SiteGeneralConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { trpc } from "../trpc";
import { SiteSettings } from "../../schema/settings-schema";

export const SiteGeneralConfiguration = () => {
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const siteSettingsQuery = trpc.siteSettings.read.useQuery();
  const siteSettingsMutation = trpc.siteSettings.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.siteSettings.read.invalidate();
    },
  });

  if (siteSettingsQuery.isLoading) {
    return (
      <SiteGeneralConfigurationSurface>
        <CardLoader />
      </SiteGeneralConfigurationSurface>
    );
  }

  return (
    <SiteGeneralConfigurationSurface>
      <Card>
        <CardTitle>Site-level Configuration for {sdk.extension.name}</CardTitle>
        <br />
        <Form
          defaultValues={
            siteSettingsQuery.data ?? {
              enabled: false,
              siteSetting: "",
            }
          }
          schema={SiteSettings}
          onSubmit={siteSettingsMutation.mutateAsync}
        >
          <Checkbox
            name="enabled"
            label="Enabled for site?"
            helpText="Turn this on to enable build modification for this site."
          />
          <FormField
            name="siteSetting"
            type="text"
            label="Some site setting"
            helpText="You can put any reasonable string here"
          />
        </Form>
        <hr />
        The code for this surface can be seen here:
        <ul>
          <li>
            &nbsp;&nbsp;
            <Link href="https://github.com/netlify/extension-showcase/blob/main/src/ui/surfaces/SiteGeneralConfiguration.tsx">
              React UI code
            </Link>
          </li>
          <li>
            &nbsp;&nbsp;
            <Link href="https://github.com/netlify/extension-showcase/blob/main/src/server/router.ts">
              Server code
            </Link>
          </li>
        </ul>
      </Card>
    </SiteGeneralConfigurationSurface>
  );
};
