"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await strapi
      .service("plugin::users-permissions.providers-registry")
      .register(`google`, ({ purest }) => async ({ query }) => {
        const google = purest({ provider: "google" });

        const res = await google
          .get("https://www.googleapis.com/oauth2/v3/userinfo")
          .auth(query.access_token)
          .request();

        console.log("This is the response", res);
        console.log("This is google", google);

        const { body } = res;

        return {
          email: body.email,
          first_name: body.given_name,
          last_name: body.family_name,
          profile_picture: body.picture,
          provider: "google",
          username: body.name,
        };
      });
  },
};
