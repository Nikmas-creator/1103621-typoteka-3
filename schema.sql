CREATE DATABASE typoteka WITH
    OWNER = nikmas
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
		TEMPLATE template0
    CONNECTION LIMIT = -1;

\c typoteka;

DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id BIGSERIAL NOT NULL,
  email varchar(100) NOT NULL,
	firstname VARCHAR(100) NOT NULL,
	lastname VARCHAR(100) NOT NULL,
	user_password varchar(100) NOT NULL,
	avatar varchar(100) NOT NULL,
  CONSTRAINT user_pk PRIMARY KEY (id, email)
);

CREATE TABLE articles (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	title varchar(100) NOT NULL,
	release_date date NOT NULL,
  announce text NOT NULL,
  wholetext text NOT NULL,
  picture varchar(100) NOT NULL
);

CREATE TABLE categories (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	name varchar(100) NOT NULL
);

CREATE TABLE articles_categories (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	article_id bigint NOT NULL,
	category_id bigint NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE comments (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	content text NOT NULL,
	author_id bigint NOT NULL,
  author_email varchar(100) NOT NULL,
  article_id bigint NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (author_id, author_email) REFERENCES users (id, email)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);











