'use strict';

const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const chalk = require(`chalk`);
const {
  ExitCode
} = require(`../../constants`);
const moment = require(`moment`);
const _ = require(`lodash`);

const FILE_NAME = `fill-db.sql`;
const DEFAULT_COUNT = 1;
const FIXES_NUMBER_OF_USERS = 2; // better don't change

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const AvatarRestrict = {
  MIN: 1,
  MAX: 4,
};

const CommentsRestrict = {
  MIN: 2,
  MAX: 4,
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_FIRSTNAMES_PATH = `./data/firstnames.txt`;
const FILE_LASTNAMES_PATH = `./data/lastnames.txt`;
const FILE_EMAILS_PATH = `./data/emails.txt`;
const FILE_PASSWORDS_PATH = `./data/passwords.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().replace(/\r/g, ``).split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const getAvatarFileName = (number) => `avatar${number.toString().padStart(2, 0)}.jpg`;

const generateUsers = (firstnames, lastnames, emails, passwords) => {
  let users = [];

  for (let i = 0; i < FIXES_NUMBER_OF_USERS; i++) {
    users.push({
      id: `DEFAULT`,
      firstname: shuffle(firstnames)[getRandomInt(0, firstnames.length - 1)],
      lastname: shuffle(lastnames)[getRandomInt(0, lastnames.length - 1)],
      email: shuffle(emails)[getRandomInt(0, emails.length - 1)],
      password: shuffle(passwords)[getRandomInt(0, passwords.length - 1)],
      avatar: getAvatarFileName(getRandomInt(AvatarRestrict.MIN, AvatarRestrict.MAX)),
    });
  }

  return users;
};

const getSqlForFillingUsersTable = (users) => {
  let sqlForFillingUsersTable = `INSERT INTO users VALUES\n`;
  users.forEach((user) => {
    sqlForFillingUsersTable += `(${user.id}, '${user.email}', '${user.firstname}', '${user.lastname}', '${user.password}', '${user.avatar}'),\n`;
  });

  return sqlForFillingUsersTable.substring(0, sqlForFillingUsersTable.length - 2) + `;\n\n`;
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

function getRandomDateInRangeOfThreeMonths() {
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  return moment(getRandomInt(threeMonthsAgo.getTime(), currentDate.getTime())).format(`YYYY-MM-DD HH:mm`);
}

const generateArticle = (titles, sentences) => {
  const announce = shuffle(sentences).slice(0, 3).join(` `);
  const differenceArray = shuffle(_.difference(sentences, announce));
  const wholetext = differenceArray.slice(getRandomInt(1, differenceArray.length - 2)).join(` `);

  return {
    id: `DEFAULT`,
    announce,
    wholetext,
    releaseDate: getRandomDateInRangeOfThreeMonths(),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
  };
};

const getSqlForFillingArticlesTable = (
    numberOfFirstUserArticles,
    numberOfSecondUserArticles,
    titles, sentences) => {
  let sqlForFillingArticlesTable = `INSERT INTO articles VALUES \n`;

  for (let i = 0; i < numberOfFirstUserArticles; i++) {
    const article = generateArticle(titles, sentences);
    sqlForFillingArticlesTable += `(${article.id}, '${article.title}', '${article.releaseDate}', '${article.announce}', '${article.wholetext}', '${article.picture}', 1),\n`;
  }

  for (let i = 0; i < numberOfSecondUserArticles; i++) {
    const article = generateArticle(titles, sentences);
    sqlForFillingArticlesTable += `(${article.id}, '${article.title}', '${article.releaseDate}', '${article.announce}', '${article.wholetext}', '${article.picture}', 1),\n`;
  }

  return sqlForFillingArticlesTable.substring(0, sqlForFillingArticlesTable.length - 2) + `;\n\n`;
};

const getSqlForFillingCategoriesTable = (categories) => {
  let sqlForFillingCategoriesTable = `INSERT INTO categories VALUES\n`;

  categories.forEach((category) => {
    sqlForFillingCategoriesTable += `(DEFAULT, '${category}'),\n`;
  });

  return sqlForFillingCategoriesTable.substring(0, sqlForFillingCategoriesTable.length - 2) + `;\n\n`;
};

let categoriesIdArray;
const getCategoriesForTicket = (numberOfCategories) => {
  if (!categoriesIdArray) {
    categoriesIdArray = [];
    for (let i = 1; i <= numberOfCategories; i++) {
      categoriesIdArray.push(i);
    }
  }

  return shuffle(categoriesIdArray).slice(0, getRandomInt(1, 4));
};

const getSqlForFillingArticlesCategoriesTable = (numberOfArticles, numberOfCategories) => {
  let articlesCategoriesMap = new Map();

  for (let i = 1; i <= numberOfArticles; i++) {
    articlesCategoriesMap.set(i, getCategoriesForTicket(numberOfCategories));
  }

  let sqlForFillingArticlesCategoriesTable = `INSERT INTO articles_categories VALUES\n`;
  articlesCategoriesMap.forEach((value, key) => {
    value.forEach((categoryId) => {
      sqlForFillingArticlesCategoriesTable += `(DEFAULT, ${key}, ${categoryId}),\n`;
    });
  });

  return sqlForFillingArticlesCategoriesTable.substring(0, sqlForFillingArticlesCategoriesTable.length - 2) + `;\n\n`;
};

const getCommentsForArticle = (comments) => {
  const numberOfComments = getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX);

  let commentsObjectsArray = new Array(numberOfComments).fill({}).map(() => ({
    content: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    authorId: getRandomInt(1, FIXES_NUMBER_OF_USERS),
  }));

  return commentsObjectsArray;
};

const getSqlForFillingCommentsTable = (comments, numberOfArticles) => {
  let articlesIdCommentsMap = new Map();

  for (let i = 1; i < numberOfArticles; i++) {
    articlesIdCommentsMap.set(i, getCommentsForArticle(comments));
  }

  let sqlForFillingCommentsTable = `INSERT INTO comments VALUES\n`;
  articlesIdCommentsMap.forEach((value, key) => {
    value.forEach((comment) => {
      sqlForFillingCommentsTable += `(DEFAULT, '${comment.content}', ${comment.authorId}, ${key}),\n`;
    });
  });

  return sqlForFillingCommentsTable.substring(0, sqlForFillingCommentsTable.length - 2) + `;\n\n`;
};

const generateFillingCode = (parameters) => {
  let {count, firstnames, lastnames,
    emails, passwords,
    sentences, titles, categories, comments} = parameters;

  const users = generateUsers(firstnames, lastnames, emails, passwords);
  let content = `SET client_encoding = 'UTF8';\n\n`;

  content += getSqlForFillingUsersTable(users);

  const numberOfFirstUserTickets = Math.floor(count / 2);
  const numberOfSecondUserTickets = count - numberOfFirstUserTickets;

  content += getSqlForFillingArticlesTable(numberOfFirstUserTickets, numberOfSecondUserTickets,
      titles, sentences);

  content += getSqlForFillingCategoriesTable(categories);

  content += getSqlForFillingArticlesCategoriesTable(count, categories.length);

  content += getSqlForFillingCommentsTable(comments, count);

  return content;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    let countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer < 1) {
      countOffer = DEFAULT_COUNT;
    } else if (countOffer > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const firstnames = await readContent(FILE_FIRSTNAMES_PATH);
    const lastnames = await readContent(FILE_LASTNAMES_PATH);
    const emails = await readContent(FILE_EMAILS_PATH);
    const passwords = await readContent(FILE_PASSWORDS_PATH);

    const parameters = {
      sentences,
      titles,
      categories,
      comments,
      count: countOffer,
      firstnames,
      lastnames,
      emails,
      passwords,
    };

    const content = generateFillingCode(parameters);

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
