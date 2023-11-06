// module.exports = {
//   routes: [
//     {
//       method: "POST",
//       path: "/create-document",
//       handler: "user-document.createDocument",
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: "GET",
//       path: "/documents",
//       handler: "user-document.getDocumentsByUser",
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: "GET",
//       path: "/document/:id",
//       handler: "user-document.getSingleDocument",
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: "DELETE",
//       path: "/document/:id",
//       handler: "user-document.deleteDocument",
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//   ],
// };

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::user-document.user-document");
