'use strict';

const logger = require(`pino`)({
  name: `server`,
  level: process.env.LOG_LEVEL || `info`
}, `./src/service/logs/logs.log`);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};

