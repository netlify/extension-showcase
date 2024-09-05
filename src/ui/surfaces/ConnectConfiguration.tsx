import {
  Card,
  CardLoader,
  CardTitle,
  ConnectConfigurationSurface,
  Form,
  FormField,
} from "@netlify/sdk/ui/react/components";
import { trpc } from "../trpc";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { CommonDataSourceSchema, ConnectSettings } from "../../schema/settings-schema";

export const ConnectConfiguration = () => {
  const sdk = useNetlifySDK();
  const accountSettingQuery = trpc.readAccountSetting.useQuery();
  const baseInput = {
    dataLayerId: sdk.context.dataLayerId!,
    configurationId: sdk.context.configurationId ?? undefined,
  };
  const connectSettingsQuery = trpc.connectSettings.read.useQuery(baseInput);
  const connectSettingsMutation = trpc.connectSettings.upsert.useMutation();

  const onSubmit = async (data: ConnectSettings & CommonDataSourceSchema) => {
    await connectSettingsMutation.mutateAsync({
      ...baseInput,
      name: data.name,
      prefix: data.prefix,
      config: data,
    });
    sdk.requestTermination();
  };

  return (
    <ConnectConfigurationSurface>
      {accountSettingQuery.isLoading ? (
        <CardLoader />
      ) : (
        <Card>
          <CardTitle>Welcome to the Showcase data source</CardTitle>
          <p>
            That account setting from the team-level configuration:{" "}
            <code>{accountSettingQuery.data}</code>
          </p>
        </Card>
      )}
      {connectSettingsQuery.isLoading ? (
        <CardLoader />
      ) : (
        <Card>
          <CardTitle>Data Source Configuration</CardTitle>
          <Form
            defaultValues={
              connectSettingsQuery.data ? {
                ...connectSettingsQuery.data,
                numberOfMockItems: connectSettingsQuery.data.config.numberOfMockItems ?? 5,
              } : {
                numberOfMockItems: 5,
                name: "",
                prefix: "",
              }
            }
            schema={ConnectSettings.merge(CommonDataSourceSchema)}
            onSubmit={onSubmit}
          >
            <FormField label="Data Source Name" name="name" required />
            <FormField
              label="Data Source Prefix"
              name="prefix"
              helpText="The prefix to use for types synced from this data source. It must start with an uppercase letter and can only consist of alphanumeric characters and underscores. For example, Product becomes {Prefix}Product."
              required
            />
            <FormField
              name="numberOfMockItems"
              type="number"
              label="Number of Mock Items to Create"
              helpText="Enter a number, at least 1"
              required
            />
          </Form>
        </Card>
      )}
    </ConnectConfigurationSurface>
  );
};
