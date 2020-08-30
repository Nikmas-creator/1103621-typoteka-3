'use strict';

const {
  Router
} = require(`express`);
const fs = require(`fs`).promises;
const axios = require(`axios`);

const PATH_TO_SERVICE = `http://localhost:3000`;

const articlesRouter = new Router();

const postArticle = async (article) => {
  let response = {};
  try {
    response = await axios.post(`${PATH_TO_SERVICE}/api/articles`, article);
    return response;
  } catch (error) {
    console.log(error);
    response.status = 400;
    return response;
  }
};

const normalizeArticle = ((bodyOffer) => {
  const {
    fields,
    picture
  } = bodyOffer;
  const normalizedArticle = {
    title: fields.title,
    announce: fields.announce,
    fulltext: fields.fulltext,
    createdDate: fields.createdDate,
    category: [`Разное`, `За жизнь`],
    picture
  };

  console.log(`Normalized article: ${JSON.stringify(normalizedArticle)}`);

  return normalizedArticle;
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts/articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`posts/new-post`));

articlesRouter.post(`/add`, async (req, res) => {
  console.log(req.fields);
  const AVATARS_PATH = `src/express/public/img/`;
  const {
    type,
    size,
    path,
    name
  } = req.files.picture;
  const allowTypes = [`image/jpeg`, `image/png`];

  if (size === 0 || !allowTypes.includes(type)) {
    fs.unlink(path);
    console.log(`Object to render: ${JSON.stringify({
      fields: req.fields
    })}`);
    res.render(`posts/new-post`, {
      fields: req.fields
    });

    return;
  }

  try {
    await fs.rename(path, AVATARS_PATH + name);
  } catch (error) {
    console.log(error);
  }

  const response = await postArticle(normalizeArticle({
    fields: req.fields,
    picture: name
  }));

  if (response.status === 201) {
    res.redirect(`/my`);
  } else {
    console.log(`Object to render: ${JSON.stringify({
      fields: req.fields,
      picture: name
    })}`);
    res.render(`posts/new-post`, {
      fields: req.fields,
      picture: name
    });
  }
});

articlesRouter.get(`/edit/:id`, (req, res) => res.render(`posts/post`));
articlesRouter.get(`/:id`, (req, res) => res.render(`posts/post`));

module.exports = articlesRouter;
