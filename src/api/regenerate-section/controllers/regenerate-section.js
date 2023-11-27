"use strict";

const { regenerateSection } = require("../../../../utils/regenerateSection");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::landing-page.landing-page",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async regenerate(ctx) {
      try {
        //ctx.body = "ok";
        const process = await regenerateSection(ctx.request.body);
        ctx.response.body = { ...process };
        return ctx;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
