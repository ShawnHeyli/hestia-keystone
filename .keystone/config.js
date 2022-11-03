"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var isAdmin = ({ session: session2 }) => session2?.data.isAdmin;
var lists = {
  User: (0, import_core.list)({
    access: isAdmin,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      projects: (0, import_fields.relationship)({ ref: "Project.author", many: true }),
      isAdmin: (0, import_fields.checkbox)({ defaultValue: false })
    }
  }),
  Project: (0, import_core.list)({
    access: {
      operation: {
        query: import_access.allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin
      }
    },
    fields: {
      title: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      demoLink: (0, import_fields.text)({}),
      sourceLink: (0, import_fields.text)({}),
      logo: (0, import_fields.relationship)({
        ref: "Image",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineCreate: { fields: ["image", "altText"] },
          linkToItem: true,
          inlineConnect: true
        }
      }),
      mainImage: (0, import_fields.relationship)({
        ref: "Image",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineCreate: { fields: ["image", "altText"] },
          linkToItem: true,
          inlineConnect: true
        }
      }),
      article: (0, import_fields_document.document)({
        formatting: true,
        layouts: [[1, 1]],
        links: true,
        dividers: true
      }),
      author: (0, import_fields.relationship)({
        ref: "User.projects",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      })
    }
  }),
  Image: (0, import_core.list)({
    access: {
      operation: {
        query: import_access.allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin
      }
    },
    fields: {
      image: (0, import_fields.image)({ storage: "local_images" }),
      altText: (0, import_fields.text)({
        validation: {
          isRequired: true
        }
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && true) {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "isAdmin",
  secretField: "password"
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var {
  ASSET_BASE_URL: baseUrl = "http://localhost:3000",
  DATABASE_URL = "http://localhost:3000"
} = process.env;
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "postgresql",
      url: DATABASE_URL
    },
    lists,
    session,
    server: {
      cors: void 0,
      port: 3333,
      maxFileSize: 20 * 1024 * 1024,
      healthCheck: true,
      extendExpressApp: void 0,
      extendHttpServer: void 0
    },
    storage: {
      local_images: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    }
  })
);
