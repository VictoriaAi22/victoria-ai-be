module.exports = {
  routes: [
    {
      method: "POST",
      path: "/generate-document",
      handler: "generate-document.generate",
      config: {
        auth: false,
      },
    },
  ],
};
