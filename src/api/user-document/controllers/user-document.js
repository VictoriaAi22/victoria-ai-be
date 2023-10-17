"use strict";

/**
 * user-document controller
 */

module.exports = {
  /**
   * Create-new-use document
   */
  async createDocument(ctx) {
    const { user } = ctx.state; //Get the logged-in user
    const { templateId } = ctx.request.body;

    // Find the template
    const template = await strapi.query("api::template.template").findOne({
      where: {
        id: templateId,
      },
    });
    console.log(template);
    if (!template) {
      return ctx.throw(404, "Template not found");
    } else {
      return ctx.send({ data: template });
    }
  },
};

// const { createCoreController } = require("@strapi/strapi").factories;
// module.exports = createCoreController("api::user-document.user-document");
