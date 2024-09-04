import { useNetlifySDK } from "@netlify/sdk/ui/react";
import {
  Card,
  CardTitle,
  SiteGeneralConfigurationSurface
} from "@netlify/sdk/ui/react/components";

export const SiteGeneralConfiguration = () => {
  const sdk = useNetlifySDK();

  return (
    <SiteGeneralConfigurationSurface>
      <Card>
        <CardTitle>Example Section for {sdk.extension.name}</CardTitle>
        <p>This is an example site configuration.</p>
      </Card>
    </SiteGeneralConfigurationSurface>
  );
};
