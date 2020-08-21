'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`category`, `announce`, `fulltext`, `title`, `createdDate`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const allKeysExist = articleKeys.every((key) => keys.includes(key));

  if (!allKeysExist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    return;
  }

  next();
};
