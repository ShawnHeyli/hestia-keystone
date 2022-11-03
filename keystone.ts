// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";
import dotenv from "dotenv";
dotenv.config();
const {
  // The base URL to serve assets from
  ASSET_BASE_URL: baseUrl = "http://localhost:3000",
  DATABASE_URL: DATABASE_URL = "http://localhost:3000",
} = process.env;

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: DATABASE_URL,
    },
    lists,
    session,
    server: {
      cors: undefined,
      port: 3333,
      maxFileSize: 20 * 1024 * 1024,
      healthCheck: true,
      extendExpressApp: undefined,
      extendHttpServer: undefined,
    },
    storage: {
      // The key here will be what is referenced in the image field
      local_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images",
        },
        storagePath: "public/images",
      },
    },
  })
);
