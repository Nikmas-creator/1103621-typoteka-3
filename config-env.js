'use strict';

require(`dotenv`).config();

module.exports = {
  DB_HOST: process.env.BAS_DB_HOST,
  DB_NAME: process.env.BAS_DB_NAME,
  DB_USER: process.env.BAS_DB_USER,
  DB_PASSWORD: process.env.BAS_DB_PASSWORD,
  DB_DIALECT: process.env.BAS_DB_DIALECT,
};

