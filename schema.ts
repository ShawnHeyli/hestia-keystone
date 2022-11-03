// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  image,
  checkbox,
} from "@keystone-6/core/fields";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types";

type Session = {
  data: {
    id: string;
    isAdmin: boolean;
  };
};
const isAdmin = ({ session }: { session: Session }) => session?.data.isAdmin;

export const lists: Lists = {
  User: list({
    access: isAdmin,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      projects: relationship({ ref: "Project.author", many: true }),

      isAdmin: checkbox({ defaultValue: false }),
    },
  }),

  Project: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },

    // this is the fields for our Post list
    fields: {
      title: text({ isIndexed: "unique", validation: { isRequired: true } }),
      demoLink: text({}),
      sourceLink: text({}),

      logo: relationship({
        ref: "Image",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineCreate: { fields: ["image", "altText"] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),
      mainImage: relationship({
        ref: "Image",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineCreate: { fields: ["image", "altText"] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),

      // Actual content of the post
      article: document({
        formatting: true,
        layouts: [[1, 1]],
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.projects",

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        many: false,
      }),
    },
  }),
  Image: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },
    fields: {
      image: image({ storage: "local_images" }),
      altText: text({
        validation: {
          isRequired: true,
        },
      }),
    },
  }),
};
