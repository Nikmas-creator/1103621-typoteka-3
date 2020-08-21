'use strict';

const articleValidator = require(`./article-validator`);
const articleExists = require(`./article-exists`);
const commentValidator = require(`./comment-validator`);

module.exports = {
  articleValidator,
  articleExists,
  commentValidator,
};
