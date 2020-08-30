'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`category`, `announce`, `fulltext`, `title`, `createdDate`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  console.log(JSON.stringify(newArticle));
  const keys = Object.keys(newArticle);
  const allKeysExist = articleKeys.every((key) => keys.includes(key) && newArticle[key].length > 0);
  console.log(`allKeysExist: ${allKeysExist}`);
  if (!allKeysExist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    return;
  }

  next();
};
