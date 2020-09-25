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
	id BIGSERIAL PRIMARY KEY NOT NULL,
  email varchar(100) NOT NULL,
	firstname VARCHAR(100) NOT NULL,
	lastname VARCHAR(100) NOT NULL,
	user_password varchar(100) NOT NULL,
	avatar varchar(100) NOT NULL
);
CREATE UNIQUE INDEX users_email_index ON users (email);
CREATE INDEX users_firstname_index ON users (firstname);
CREATE INDEX users_lastname_index ON users (lastname);
CREATE INDEX users_user_password_index ON users (user_password);
CREATE INDEX users_avatar_index ON users (avatar);

CREATE TABLE articles (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	title varchar(100) NOT NULL,
	release_date date NOT NULL,
  announce text NOT NULL,
  wholetext text NOT NULL,
  picture varchar(100) NOT NULL
);
CREATE INDEX users_title_index ON articles (title);
CREATE INDEX users_release_date_index ON articles (release_date);
CREATE INDEX users_announce_index ON articles (announce);
CREATE INDEX users_wholetext_index ON articles (wholetext);
CREATE INDEX users_picture_index ON articles (picture);

CREATE TABLE categories (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	name varchar(100) NOT NULL
);
CREATE INDEX users_name_index ON categories (name);

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
CREATE INDEX articles_categories_articles_id_index ON articles_categories (articles_id);
CREATE INDEX articles_categories_category_id_index ON articles_categories (category_id);

CREATE TABLE comments (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	content text NOT NULL,
	author_id bigint NOT NULL,
  article_id bigint NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE INDEX comments_content_index ON comments (content);
CREATE INDEX comments_author_id_index ON comments (author_id);
CREATE INDEX comments_article_id_index ON comments (article_id);











