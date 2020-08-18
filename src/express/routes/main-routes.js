'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main`));
mainRouter.get(`/login`, (req, res) => res.render(`entry/login`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));
mainRouter.get(`/register`, (req, res) => res.render(`entry/sign-up`));

module.exports = mainRouter;
