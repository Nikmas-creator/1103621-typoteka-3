'use strict';

const Sequelize = require(`sequelize`);
const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
} = require(`../../config-env`);
const {
  getLogger
} = require(`../logger/backend-logger`);
const logger = getLogger();
const {ExitCode} = require(`../constants`);

module.exports = async () => {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
  });

  logger.debug(`Start connecting to the data base...`);
  try {
    await sequelize.authenticate();
    logger.debug(`Connected successfully!`);
  } catch (err) {
    logger.error(`Connection error: ${err}`);
    process.exit(ExitCode.error);
  }

  return sequelize;
};
