'use strict';

const {
  Router
} = require(`express`);
const axios = require(`axios`);
const {
  shuffle
} = require(`../../utils`);

const mainRouter = new Router();

const PATH_TO_SERVICE = `http://localhost:3000`;

const getAllArticles = async () => {
  try {
    const serviceResp = await axios.get(`${PATH_TO_SERVICE}/api/articles`);
    return serviceResp.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getFourRandomArticles = async () => {
  const allArticles = await getAllArticles();
  const shuffledArticles = shuffle(allArticles);

  return shuffledArticles.slice(0, 4);
};

const findArticlesByQueryString = async (queryStr) => {
  try {
    const foundOffers = await axios.get(encodeURI(`${PATH_TO_SERVICE}/api/search?query=${queryStr}`));
    return foundOffers.data;
  } catch (error) {
    return [];
  }

};

mainRouter.get(`/`, async (req, res) => {
  const articles = await getFourRandomArticles();
  res.render(`main`, {
    articles
  });

});
mainRouter.get(`/login`, (req, res) => res.render(`entry/login`));
mainRouter.get(`/search`, async (req, res) => {
  res.render(`search`);
});
mainRouter.post(`/search`, async (req, res) => {
  // console.log(`req.fields: ${JSON.stringify(req.fields.search)}`);
  const articles = await findArticlesByQueryString(req.fields.search);
  // console.log(`${JSON.stringify(articles)}`);
  res.render(`search`, {
    articles
  });
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));
mainRouter.get(`/register`, (req, res) => res.render(`entry/sign-up`));

module.exports = mainRouter;
