// In api/verification-code/services/verification-code.js

module.exports = {
  async create({ user, code }) {
    return strapi.query("verification-code").create({
      user,
      code,
    });
  },

  async findOneByCode(code) {
    return strapi.query("verification-code").findOne({
      code,
    });
  },

  async deleteById(id) {
    return strapi.query("verification-code").delete({
      id,
    });
  },
};
