module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-document",
      handler: "user-document.createDocument",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
