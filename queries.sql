-- Get the list of the all categories
SELECT 
  categories.id,
  categories.name AS "Name"
FROM categories;

-- Get the list of the categories, for which more than 1 article was created
SELECT 
  categories.id,
  categories.name AS "Name"
FROM categories
INNER JOIN articles_categories
  ON categories.id = articles_categories.category_id
GROUP BY 
  categories.id, categories.name
HAVING 
  count(articles_categories.article_id) >= 1;

-- Get the list of categories with the ammount of articles
SELECT 
  categories.id,
  categories.name AS "Name",
  count(articles_categories.article_id)
FROM categories
INNER JOIN articles_categories
  ON categories.id = articles_categories.category_id
GROUP BY 
  categories.id, categories.name
ORDER BY
  count(articles_categories.article_id) DESC;

-- Get the list of all articles (the newest firstly)
SELECT
  articles.id AS "Id",
  articles.title AS "Title",
  articles.announce AS "Announce",
  to_char(articles.creation_date, 'DD-MM-YYYY, HH24:MI') AS "Creation date",
  concat(users.firstname, ' ', users.lastname) AS "Author",
  users.email AS "Author email",
  count(comments.id),
  string_agg(distinct categories.category_name, ', ')
FROM articles
INNER JOIN users
  ON articles.author_id = users.id
INNER JOIN comments
  ON comments.article_id = articles.id
INNER JOIN
(
  SELECT 
    articles_categories.article_id AS article_id,
    categories.name AS category_name
  FROM articles_categories
  INNER JOIN categories
    ON articles_categories.category_id = categories.id
) categories
ON articles.id = categories.article_id
GROUP BY 
  articles.id, articles.title, articles.announce, 
  users.firstname, users.lastname, users.email;

-- Get the whole info of the particular article
SELECT
  articles.id AS "Id",
  articles.title AS "Title",
  articles.announce AS "Announce",
  articles.wholetext AS "Whole text",
  to_char(articles.creation_date, 'DD-MM-YYYY, HH24:MI') AS "Creation date",
  concat(users.firstname, ' ', users.lastname) AS "Author",
  users.email AS "Author email",
  count(comments.id),
  string_agg(distinct categories.category_name, ', ')
FROM articles
INNER JOIN users
  ON articles.author_id = users.id
INNER JOIN comments
  ON comments.article_id = articles.id
INNER JOIN
(
  SELECT 
    articles_categories.article_id AS article_id,
    categories.name AS category_name
  FROM articles_categories
  INNER JOIN categories
    ON articles_categories.category_id = categories.id
) categories
ON articles.id = categories.article_id
GROUP BY 
  articles.id, articles.title, articles.wholetext, 
  articles.announce, users.firstname,
  users.lastname, users.email
HAVING -- conditions of the search
  articles.id = 3; 

-- Get the list of 5 newest comments
SELECT
  comments.id AS "Id",
  comments.article_id AS "Article id",
  concat(users.firstname, ' ', users.lastname) AS "Author",
  comments.content AS "Text"
FROM comments
INNER JOIN users
  ON comments.author_id = users.id
ORDER BY 
  comments.creation_date DESC
LIMIT 5;

-- Get the list of comments for the particular article (the newest firstly)
SELECT
  comments.id AS "Id",
  comments.article_id AS "Article id",
  concat(users.firstname, ' ', users.lastname) AS "Author",
  comments.content AS "Text"
FROM comments
INNER JOIN users
  ON comments.author_id = users.id
WHERE
  comments.article_id = 3
ORDER BY
  comments.creation_date DESC;

-- Update the title of the particular article
UPDATE articles
  set title = 'Как я встретил Новый год'
WHERE
  articles.id = 3;













