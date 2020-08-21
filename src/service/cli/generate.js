'use strict';

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const _ = require(`lodash`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  ExitCode
} = require(`../../constants`);
const moment = require(`moment`);
const {nanoid} = require(`nanoid`);

const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 4;

const FILE_NAME = `mocks.json`;

const DEFAULT_COUNT = 1;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

function getRandomDateInRangeOfThreeMonths() {
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  return moment(getRandomInt(threeMonthsAgo.getTime(), currentDate.getTime())).format(`YYYY-MM-DD HH:mm:ss`);
}

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, sentences, categories, comments) => {
  let articles = [];

  for (let i = 0; i < count; i++) {
    const announce = shuffle(sentences).slice(0, 5).join(` `);
    const differenceArray = shuffle(_.difference(sentences, announce));
    const fulltext = differenceArray.slice(getRandomInt(1, differenceArray.length - 2)).join(` `);

    const createdDate = getRandomDateInRangeOfThreeMonths();

    articles.push({
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce,
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      fulltext,
      createdDate,
      category: shuffle(categories).slice(getRandomInt(1, categories.length - 2))
    });
  }

  return articles;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().replace(/\r/g, ``).split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const comments = await readContent(FILE_COMMENTS_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    let articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (articlesCount < 1) {
      articlesCount = DEFAULT_COUNT;
    } else if (articlesCount > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    try {
      await fs.writeFile(FILE_NAME, JSON.stringify(generateArticles(articlesCount, titles, sentences, categories, comments)));
      console.log(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file: ${err}`));
      process.exit(ExitCode.error);
    }
  }
};
