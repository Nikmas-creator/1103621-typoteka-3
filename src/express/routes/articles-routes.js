'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts/articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`posts/new-post`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`posts/post`));
articlesRouter.get(`/:id`, (req, res) => res.render(`posts/post`));

module.exports = articlesRouter;
