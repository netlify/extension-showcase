import {
  Card,
  CardLoader,
  CardTitle,
  Link,
  SiteConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { trpc } from "../trpc";

export const SiteConfiguration = () => {
  const sdk = useNetlifySDK();
  const accountSettingQuery = trpc.readAccountSetting.useQuery();
  const siteSettingsQuery = trpc.siteSettings.read.useQuery();

  const siteSettingsSummary =
    siteSettingsQuery.data?.enabled ?? false ? (
      <>
        <p>
          The extension <strong>is</strong> enabled for this site and will
          affect its builds.
        </p>
        <p>
          The site-level setting (from Site configuration &gt; General &gt;
          Showcase) is: <code>{siteSettingsQuery.data?.siteSetting}</code>
        </p>
      </>
    ) : (
      <p>
        The extension is <strong>not</strong> enabled for this site and won't
        affect its builds.
      </p>
    );

  return (
    <SiteConfigurationSurface>
      <Card>
        <CardTitle>Site-Level Section for {sdk.extension.name}</CardTitle>
        <p>This is an example site-level page.</p>
      </Card>
      {accountSettingQuery.isLoading || siteSettingsQuery.isLoading ? (
        <CardLoader />
      ) : (
        <Card>
          <CardTitle>Some Data Summary</CardTitle>
          <p>
            That account setting from the team-level configuration:{" "}
            <code>{accountSettingQuery.data}</code>
          </p>
          {siteSettingsSummary}
        <hr />
        The code for this surface can be seen here:
        <ul>
          <li>&nbsp;&nbsp;<Link href="https://github.com/netlify/extension-showcase/blob/main/src/ui/surfaces/SiteConfiguration.tsx" target="_blank">React UI code</Link></li>
          <li>&nbsp;&nbsp;<Link href="https://github.com/netlify/extension-showcase/blob/main/src/server/router.ts" target="_blank">Server code</Link></li>
        </ul>
        </Card>
      )}
    </SiteConfigurationSurface>
  );
};
