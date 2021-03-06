'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {articleId: articleId} = req.params;
  const article = service.findOne(articleId);

  if (!article) {
    res.status(HttpCode.NOT_FOUND)
      .send(`The article with the id ${articleId} is not found`);
    return;
  }

  res.locals.article = article;
  next();
};
