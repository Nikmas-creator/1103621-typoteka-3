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

const FILE_NAME = `mocks.json`;

const DEFAULT_COUNT = 1;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки— это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор— всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок - музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок - музыка всегда ассоциировалась с протестами. Так ли это на самом деле ?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло - партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

function getRandomDateInRangeOfThreeMonths() {
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  return moment(getRandomInt(threeMonthsAgo.getTime(), currentDate.getTime())).format(`YYYY-MM-DD HH:mm:ss`);
}

const generateArticles = (count) => {
  let articles = [];

  for (let i = 0; i < count; i++) {
    const announce = shuffle(SENTENCES).slice(0, 5).join(` `);
    const differenceArray = shuffle(_.difference(SENTENCES, announce));
    const fulltext = differenceArray.slice(getRandomInt(1, differenceArray.length - 2)).join(` `);

    const createdDate = getRandomDateInRangeOfThreeMonths();

    articles.push({
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      announce,
      fulltext,
      createdDate,
      category: shuffle(CATEGORIES).slice(getRandomInt(1, CATEGORIES.length - 2))
    });
  }

  return articles;
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    let articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (articlesCount < 1) {
      articlesCount = DEFAULT_COUNT;
    } else if (articlesCount > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    try {
      await fs.writeFile(FILE_NAME, JSON.stringify(generateArticles(articlesCount)));
      console.log(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file: ${err}`));
      process.exit(ExitCode.error);
    }
  }
};
