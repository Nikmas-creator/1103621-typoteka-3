'use strict';

const {getLogger} = require(`../logger`);
const logger = getLogger();

const middleware = (req, res, next) => {
  logger.debug(`Start request to url ${req.url}`);
  next();
};

module.exports = middleware;
