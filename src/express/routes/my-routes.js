'use strict';

const {
  Router
} = require(`express`);
const axios = require(`axios`);
const {
  shuffle,
  getRandomInt
} = require(`../../utils`);
const {
  getLogger
} = require(`../../logger/frontend-logger`);
const logger = getLogger();

const myRouter = new Router();

const PATH_TO_SERVICE = `http://localhost:3000`;

const getAllArticles = async () => {
  try {
    const serviceResp = await axios.get(`${PATH_TO_SERVICE}/api/articles`);
    return serviceResp.data;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

const getRandomAmountOfArticles = async () => {
  const articles = await getAllArticles();
  return shuffle(articles).slice(getRandomInt(1, articles.length - 2));
};

const getFirstThreeArticles = async () => {
  const firstThreeArticles = await getAllArticles();

  return firstThreeArticles.slice(0, 3);
};


myRouter.get(`/`, async (req, res) => {
  const articles = await getRandomAmountOfArticles();
  res.render(`posts/my`, {
    articles
  });
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await getFirstThreeArticles();
  res.render(`comments`, {
    articles
  });
});

module.exports = myRouter;
