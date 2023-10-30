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
    const { templateId, company } = ctx.request.body;

    // Find the template
    // const template = await strapi.entityService.findOne(
    //   "api::template.template",
    //   templateId,
    //   {
    //     populate: {
    //       coverLetter: {
    //         populate: {
    //           section: true,
    //           previewImage: true,
    //         },
    //       },
    //       resume: {
    //         populate: {
    //           sections: true,
    //           previewImage: true,
    //           customSection: true,
    //         },
    //       },
    //     },
    //   }
    // );

    const template = await strapi.entityService.findOne(
      "api::template.template",
      templateId,
      {
        populate: {
          template: {
            populate: {
              coverLetter: {
                populate: {
                  section: true,
                  previewImage: true,
                },
              },
              resume: {
                populate: {
                  sections: true,
                  previewImage: true,
                },
              },
            },
          },
        },
      }
    );
    if (!template) {
      return ctx.throw(404, "Template not found");
    }

    // if the template is found, clone the template to the userdocument
    const create = await strapi.entityService.create(
      "api::user-document.user-document",
      {
        data: {
          users_permissions_user: user.id,
          title: company || "",
          template: template.template,
        },
      }
    );

    ctx.send({
      status: true,
      data: create,
      message: "Document created successfully",
    });
  },
  async getDocumentsByUser(ctx) {
    const { user } = ctx.state;

    // get all user documents
    const document = await strapi.entityService.findMany(
      "api::user-document.user-document",
      {
        filters: {
          users_permissions_user: user.id,
        },
        populate: {
          template: {
            populate: {
              coverLetter: {
                populate: {
                  section: true,
                  previewImage: true,
                },
              },
              resume: {
                populate: {
                  sections: true,
                  previewImage: true,
                  customSection: true,
                },
              },
            },
          },
        },
      }
    );
    return ctx.send({
      status: true,
      data: document,
    });
  },

  async getSingleDocument(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const findUserDoc = await strapi.db
      .query("api::user-document.user-document")
      .findOne({
        where: {
          users_permissions_user: user.id,
          id,
        },
      });

    if (!findUserDoc) return ctx.throw(404, "document not found");

    const document = await strapi.entityService.findOne(
      "api::user-document.user-document",
      id,
      {
        filters: {
          users_permissions_user: user.id,
        },
        populate: {
          template: {
            populate: {
              coverLetter: {
                populate: {
                  section: true,
                  previewImage: true,
                },
              },
              resume: {
                populate: {
                  sections: true,
                  previewImage: true,
                  customSection: true,
                },
              },
            },
          },
        },
      }
    );

    return ctx.send({
      data: document,
      status: true,
    });
  },

  // async updateDocument(ctx) {
  //   const { id } = ctx.params;
  //   const { user } = ctx.state;
  //   const { body } = ctx.request;

  //   // Check if the user is the owner of the document
  //   const findUserDoc = await strapi.db
  //     .query("api::user-document.user-document")
  //     .findOne({
  //       where: {
  //         users_permissions_user: user.id,
  //         id,
  //       },
  //     });

  //   if (!findUserDoc) return ctx.throw(404, "document not found");

  //   const docUpdate = await strapi.entityService.update(
  //     "api::user-document.user-document",
  //     id,
  //     {
  //       data: body,
  //     }
  //   );
  // },

  async deleteDocument(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const findUserDoc = await strapi.db
      .query("api::user-document.user-document")
      .findOne({
        where: {
          users_permissions_user: user.id,
          id,
        },
      });

    if (!findUserDoc) return ctx.throw(404, "document not found");

    await strapi.entityService.delete("api::user-document.user-document", id);

    ctx.send({
      status: true,
      message: "Document deleted successfully",
    });
  },
};
