'use strict';

const {
  HttpCode,
  API_PREFIX
} = require(`../../constants`);
const express = require(`express`);
const routes = require(`../api`);
const {
  getLogger
} = require(`../../logger/backend-logger`);
const logger = getLogger();
const expressPinoLogger = require(`express-pino-logger`)({
  logger
});
const connectDb = require(`../connect-db`);

const DEFAULT_PORT = 3000;

const app = express();


const init = async () => {
  app.use(express.json());
  app.use(expressPinoLogger);
  app.use(API_PREFIX, await routes());

  app.use((req, res) => {
    res
      .status(HttpCode.NOT_FOUND)
      .send(`The page is not found!`);

    logger.error(`Such a route doesn't exist: ${req.url}`);
  });

  return app;
};

module.exports = {
  name: `--server`,
  init,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    await init();
    await connectDb();

    app.listen(port, () => {
      logger.info(`Wait for connections on port ${port}`);
    })
      .on(`error`, (err) => {
        logger.error(`Error: ${err}`);
        process.exit(1);
      });
  }
};
