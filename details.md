The Showcase extension showcases Netlify SDK's capabilities:

## Markdown description and manual for the extension (This Section)

This section of the page is the public manual for the extension. It is visible before installation, and remains visible after installation.

You can see where it's configured here: [details.md](https://github.com/netlify/extension-showcase/blob/main/details.md).

After you install the extension, go to each of these surfaces to see the extension in action and get links to how they're implemented:

## Team-wide Surface for Configuration and Interactive Elements

This section of the page is only visible after installation. Once you install the extension, it will be visible right above this static Markdown section.

This surface can be used for:
1. Global setup, e.g. an OAuth connection or adding API keys.
1. An interactive tutorial, e.g. showing "You should do this next" or "Here's how to get started".
1. Other configuration options that would be shared among all sites or all Connect data layers.

## Site-specific Surface for Configuration and Interactive Elements

There are multiple places where surfaces can be added to the UI.

The first is as an extension-managed page in the Netlify sidebar. This is a great place for non-configuration content, such as status updates, analytics, operational actions (buttons and actions), or other site-specific information.

![Netlify sidebar with the Showcase extension](/assets/sidebar.png)



The rest are surfaces within Netlify's site configuration. You can control where it appears within site configurations, with the supported options listed here: [Site sections](https://future-state-v2-docs--sdk.netlify.com/sdk/extension-ui/add-a-new-surface/#site-sections). The Showcase extension includes one such surface in "Site configuration > General" right above the "Danger zone".

![Netlify site settings with the Showcase extension](/assets/site-settings.png)

## Data Source Configuration

If an extension provides a data source for Netlify Connect or the Netlify visual editor, then for each instance of that data source, there will be a surface to set up the data source and also show brief instructions.