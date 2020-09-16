'use strict';

const logger = require(`pino`)({
  name: `frontend-server`,
  level: process.env.LOG_LEVEL || `info`,
}, `./src/express/logs/logs.log`);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
