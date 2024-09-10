// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";
import { makeConnectSettings } from "./schema/settings-schema";

const extension = new NetlifyExtension();
const connector = extension.addConnector({
  typePrefix: "Showcase",
  supports: {
    connect: true,
    visualEditor: false,
  },
  localDevOptions: {
    numberOfMockItems: 5,
  },
  defineOptions({ zod }) {
    return makeConnectSettings(zod);
  },
});

/**
 * Define your content models here.
 * https://developers.netlify.com/sdk/api-reference/classes/netlifyconnector/#model
 */
connector.model(async ({ define }) => {
  define.document({
    name: "User",
    fields: {
      name: {
        type: "String",
        required: true,
      },
      posts: {
        type: "Post",
        list: true,
      },
    },
  });

  define.document({
    name: "Post",
    fields: {
      title: {
        type: "String",
        required: true,
      },
      blocks: {
        list: true,
        required: true,
        type: define.object({
          name: "Blocks",
          fields: {
            title: {
              type: "String",
            },
            content: {
              type: "String",
            },
          },
        }),
      },
    },
  });
});

/**
 * Fetch and store data from your API here.
 * https://developers.netlify.com/sdk/api-reference/classes/netlifyconnector/#sync
 */
connector.sync(({ models, isInitialSync, options: { numberOfMockItems } }) => {
  switch (true) {
    case isInitialSync: {
      for (let i = 0; i < numberOfMockItems; i++) {
        models.User.insert({
          id: i.toString(),
          name: `Annie ${i}`,
          posts: [
            {
              id: i.toString(),
              __typename: "Post",
            },
          ],
          _status: "published",
          _createdAt: new Date(),
        });
        models.Post.insert({
          id: i.toString(),
          title: `Hello World ${i}`,
          blocks: [
            {
              title: "Example block title",
              content: "You can create complex content models",
            },
          ],
          _status: "published",
          _createdAt: new Date(),
        });
      }
      break;
    }
    case !isInitialSync: {
      for (let i = 0; i < numberOfMockItems; i++) {
        models.User.insert({
          id: i.toString(), // overwrites the existing User node with this ID
          name: `Annie ${i}`,
          posts: [
            {
              id: i.toString(),
              __typename: "Post",
            },
          ],
          _status: "published",
          _createdAt: new Date(),
        });
        models.Post.insert({
          id: i.toString(), // creates a new Post since this ID doesn't exist yet
          title: `Writing lots of posts these days ${i}`,
          blocks: [
            {
              title: "Page section",
              content: "what up",
            },
          ],
          _status: "published",
          _createdAt: new Date(),
        });
      }
      break;
    }
  }
});

extension.addBuildEventHandler("onPreBuild", () => {
  if (process.env.SHOWCASE_ENABLED !== "1") {
    return;
  }
  console.log("======================");
  console.log("==== Hello there. ====");
  console.log("======================");
});

extension.addEdgeFunctions("./src/edge-functions", {
  prefix: "ef_prefix",
  shouldInjectFunction() {
    return process.env.SHOWCASE_ENABLED === "1";
  },
});

export { extension };
