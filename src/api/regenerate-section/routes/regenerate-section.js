module.exports = {
  routes: [
    {
      method: "POST",
      path: "/regenerate-section",
      handler: "regenerate-section.regenerate",
      config: {
        auth: false,
      },
    },
  ],
};
