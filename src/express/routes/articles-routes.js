'use strict';

const {
  Router
} = require(`express`);
const fs = require(`fs`).promises;
const axios = require(`axios`);
const formidable = require(`formidable`);
const PATH_TO_CATEGORIES = `./data/categories.txt`;
const {
  getLogger
} = require(`../../logger/frontend-logger`);
const logger = getLogger();

const PATH_TO_SERVICE = `http://localhost:3000`;

const articlesRouter = new Router();

const getArticle = async (id) => {
  const response = await axios.get(`${PATH_TO_SERVICE}/api/articles/${id}`);
  return response.data;
};

const postArticle = async (article) => {
  let response = {};
  try {
    response = await axios.post(`${PATH_TO_SERVICE}/api/articles`, article);
    return response;
  } catch (error) {
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
    category: fields[`checkbox-auto`],
    picture
  };

  return normalizedArticle;
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts/articles-by-category`));

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().replace(/\r/g, ``).split(`\n`);
  } catch (error) {
    return [];
  }
};

let allCategories;
articlesRouter.get(`/add`, async (req, res) => {
  if (!allCategories) {
    allCategories = await readContent(PATH_TO_CATEGORIES);
  }

  res.render(`posts/new-post`, {
    fields: {
      allCategories
    }
  });
});

articlesRouter.post(`/add`, async (req, res) => {
  const form = formidable({
    encoding: `utf-8`,
    uploadDir: `./tmp`,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (!allCategories) {
      allCategories = await readContent(PATH_TO_CATEGORIES);
    }

    Object.assign(fields, {
      allCategories
    });

    const AVATARS_PATH = `src/express/public/upload/`;
    const {
      type,
      size,
      path,
      name
    } = files.picture;
    const allowTypes = [`image/jpeg`, `image/png`];

    if (size === 0 || !allowTypes.includes(type)) {
      fs.unlink(path);

      res.render(`posts/new-post`, {
        fields
      });

      return;
    }

    try {
      await fs.rename(path, AVATARS_PATH + name);
    } catch (error) {
      logger.error(error);
    }

    const response = await postArticle(normalizeArticle({
      fields,
      picture: name
    }));

    if (response.status === 201) {
      res.redirect(`/my`);
    } else {
      res.render(`posts/new-post`, {
        fields,
        picture: name
      });
    }
  });

});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const article = await getArticle(req.params.id);
  res.render(`posts/post`, {
    article
  });
});
articlesRouter.get(`/:id`, async (req, res) => {
  const article = await getArticle(req.params.id);
  res.render(`posts/post`, {
    article
  });
});

module.exports = articlesRouter;
