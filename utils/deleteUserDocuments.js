async function deleteUserDocuments(strapi) {
  try {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    console.log("----sixtyDaysAgo-----", sixtyDaysAgo);

    // Find outdated entries
    const outdatedEntries = await strapi.entityService.findMany(
      "api::user-document.user-document",
      {
        filters: {
          createdAt: { $lt: sixtyDaysAgo },
        },
      }
    );

    console.log("----outdatedEntries-----", outdatedEntries);

    // Delete outdated entries
    for (const entry of outdatedEntries) {
      console.log("-----entry.id is ------", entry.id);
      await strapi.entityService.delete(
        "api::user-document.user-document",
        entry.id
      );
      console.log(`Deleted outdated entry with id: ${entry.id}`);
    }

    console.log("Deletion completed.");
  } catch (error) {
    console.error("Error deleting outdated entries:", error);
  }
}

module.exports = {
  "*/30 * * * *": async ({ strapi }) => {
    try {
      console.log("checking for oudated documents");
      await deleteUserDocuments(strapi);
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  },
};
