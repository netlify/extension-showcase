import {
  Card,
  CardTitle,
  SiteConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";

export const SiteConfiguration = () => {
  const sdk = useNetlifySDK();

  return (
    <SiteConfigurationSurface>
      <Card>
        <CardTitle>Example Section for {sdk.extension.name}</CardTitle>
        <p>This is an example site configuration.</p>
      </Card>
    </SiteConfigurationSurface>
  );
};
