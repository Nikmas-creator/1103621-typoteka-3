'use strict';

const {HttpCode} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const keysExsist = commentKeys.every((key) => keys.includes(key));

  if (!keysExsist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request: the comment has the inappropriate structure!`);
    return;
  }

  next();
};

