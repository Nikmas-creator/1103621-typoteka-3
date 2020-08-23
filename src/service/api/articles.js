'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  articleValidator,
  articleExists,
  commentValidator
} = require(`../middlewares`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  route.put(`/:articleId`, [articleValidator, articleExists(articleService)], (req, res) => {
    const {articleId} = req.params;

    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`The article with the id ${articleId} is not found!`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment with id ${commentId} is not found!`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const newComment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED)
      .json(newComment);
  });

};
