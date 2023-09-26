'use strict';

/**
 * initial-subscription service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::initial-subscription.initial-subscription');
