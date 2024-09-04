import { Card, CardTitle, ConnectConfigurationSurface } from "@netlify/sdk/ui/react/components";

export const ConnectConfiguration = () => {
  return (
    <ConnectConfigurationSurface>
      <Card>
        <CardTitle>My Connect Configuration</CardTitle>
        <p>Hello, world!</p>
      </Card>
    </ConnectConfigurationSurface>
  );
};
