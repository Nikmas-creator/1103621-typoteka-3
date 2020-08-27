'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  articleValidator,
  articleExists,
  commentValidator
} = require(`../middlewares`);

const {getLogger} = require(`../../logger/logger`);
const logger = getLogger();

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK)
      .json(article);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);

    res.status(HttpCode.CREATED)
      .json(newArticle);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.put(`/:articleId`, [articleValidator, articleExists(articleService)], (req, res) => {
    const {articleId} = req.params;

    const updatedArticle = articleService.update(articleId, req.body);

    res.status(HttpCode.OK)
      .json(updatedArticle);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);

    if (!deletedArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`The article with the id ${articleId} is not found!`);

      logger.info(`End request with status code ${res.statusCode}`);

      return;
    }

    res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Comment with id ${commentId} is not found!`);

      logger.info(`End request with status code ${res.statusCode}`);

      return;
    }

    res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const newComment = commentService.create(article, req.body);

    res.status(HttpCode.CREATED)
      .json(newComment);

    logger.info(`End request with status code ${res.statusCode}`);
  });

};
