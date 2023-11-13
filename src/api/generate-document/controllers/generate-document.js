"use strict";

const { generateDocuments } = require("../../../../utils/generateDocuments.js");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::landing-page.landing-page",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async generate(ctx) {
      try {
        //ctx.body = "ok";
        const process = await generateDocuments(ctx.request.body);
        ctx.response.body = { ...process };
        return ctx;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
