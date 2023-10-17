'use strict';

/**
 * client-profile service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::client-profile.client-profile');
