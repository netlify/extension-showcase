// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";

const extension = new NetlifyExtension();
const connector = extension.addConnector({
  typePrefix: "Example",
  supports: {
    connect: true,
    visualEditor: false,
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
connector.sync(({ models, isInitialSync }) => {
  switch (true) {
    case isInitialSync: {
      models.User.insert({
        id: "1",
        name: "Annie",
        posts: [
          {
            id: "1",
            __typename: "Post",
          },
        ],
      });
      models.Post.insert({
        id: "1",
        title: "Hello World",
        blocks: [
          {
            title: "Example block title",
            content: "You can create complex content models",
          },
        ],
      });
      break
    }
    case !isInitialSync: {
      models.User.insert({
        id: "1", // overwrites the existing User node with this ID
        name: "Annie",
        posts: [
          {
            id: "1",
            __typename: "Post",
          },
        ],
      });
      models.Post.insert({
        id: "2", // creates a new Post since this ID doesn't exist yet
        title: "Writing lots of posts these days",
        blocks: [
          {
            title: "Page section",
            content: "what up",
          },
        ],
      });
      break
    }
  }
});

extension.addBuildEventHandler("onPreBuild", () => {
  console.log("Hello there.");
});
  
extension.addEdgeFunctions("./src/edge-functions", {
  prefix: "ef_prefix",
});

export { extension };

