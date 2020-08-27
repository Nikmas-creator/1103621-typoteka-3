'use strict';

const request = require(`supertest`);
const {init} = require(`../cli/server`);
let server;
let data;
let existingArticle;
const getMockData = require(`../lib/get-mock-data`);

const falseCommentId = `8nikmas8`;

const falseArticleId = `8nikmas8`;
const trueArticle = {
  title: "Ёлки. История деревьев",
  announce: "Процессор заслуживает особого внимания.",
  fulltext: "Как начать действовать?",
  createdDate: "2020-07-08 14:09:22",
  category: ["Музыка"]
};

const falseArticle = {
  title: "Ёлки. История деревьев",
  announce: "Процессор заслуживает особого внимания.",
  createdDate: "2020-07-08 14:09:22",
  category: ["Музыка"]
};

const trueComment = {
  text: `Крутотень конечно!`
};

const falseComment = {
  smth: `#$$$$#`
};

describe(`Articles API end-points`, () => {
  beforeAll(async () => {
    server = await init();
    data = await getMockData();
    existingArticle = data[0];
  }); 

  test(`GET /api/articles: should be 200`, async () => {
    const res = await request(server)
      .get(`/api/articles`);
    expect(res.statusCode).toBe(200);
  });

  test(`GET /api/articles/trueArticleID: should be 200`, async () => {
    const res = await request(server)
      .get(`/api/articles/${existingArticle.id}`);
    expect(res.statusCode).toBe(200);
  });

  test(`GET /api/articles/falseArticleID: should be 404`, async () => {
    const res = await request(server)
      .get(`/api/articles/${falseArticleId}`);
    expect(res.statusCode).toBe(404);
  });

  test(`POST /api/articles/: should be 201`, async () => {
    const res = await request(server)
      .post(`/api/articles`)
      .send(trueArticle);
    expect(res.statusCode).toBe(201);
  });

  test(`POST /api/articles/: should be 400, the inappropriate data`, async () => {
    const res = await request(server)
      .post(`/api/articles`)
      .send(falseArticle);
    expect(res.statusCode).toBe(400);
  });

  test(`PUT /api/articles/trueArticlesID: should be 200 (true articles)`, async () => {
    const res = await request(server)
      .put(`/api/articles/${existingArticle.id}`)
      .send(trueArticle);
    expect(res.statusCode).toBe(200);
  });

  test(`PUT /api/articles/falseArticleID: should be 404 (true article)`, async () => {
    const res = await request(server)
      .put(`/api/articles/${falseArticleId}`)
      .send(trueArticle);
    expect(res.statusCode).toBe(404);
  });

  test(`PUT /api/articles/trueArticleID: should be 400 (false article)`, async () => {
    const res = await request(server)
      .put(`/api/articles/${existingArticle.id}`)
      .send(falseArticle);
    expect(res.statusCode).toBe(400);
  });

  test(`DELETE /api/articles/trueArticleID: should be 200`, async () => {
    const res = await request(server)
      .delete(`/api/articles/${existingArticle.id}`)
    expect(res.statusCode).toBe(200);
  });

  test(`DELETE /api/articles/falseArticleID: should be 404`, async () => {
    const res = await request(server)
      .delete(`/api/articles/${falseArticleId}`)
    expect(res.statusCode).toBe(404);
    existingArticle = data[1];
  });

  test(`GET /api/articles/trueArticleID/comments: should be 200`, async () => {
    const res = await request(server)
      .get(`/api/articles/${existingArticle.id}/comments`);
    expect(res.statusCode).toBe(200);
  });

  test(`GET /api/articles/falseArticleID/comments: should be 404`, async () => {
    const res = await request(server)
      .get(`/api/articles/${falseArticleId}/comments`);
    expect(res.statusCode).toBe(404);
  });

  test(`POST /api/articles/trueArticleID/comments: should be 201 (true comment)`, async () => {
    const res = await request(server)
      .post(`/api/articles/${existingArticle.id}/comments`)
      .send(trueComment);
    expect(res.statusCode).toBe(201);
  });

  test(`POST /api/articles/falseArticleID/comments: should be 404 (true comment)`, async () => {
    const res = await request(server)
      .post(`/api/articles/${falseArticleId}/comments`)
      .send(trueComment);
    expect(res.statusCode).toBe(404);
  });

  test(`POST /api/articles/trueArticleID/comments: should be 400 (false comment)`, async () => {
    const res = await request(server)
      .post(`/api/articles/${existingArticle.id}/comments`)
      .send(falseComment);
    expect(res.statusCode).toBe(400);
  });

  test(`DELETE /api/articles/trueArticleID/comments/trueCommentID: should be 200`, async () => {
    const res = await request(server)
      .delete(`/api/articles/${existingArticle.id}/comments/${existingArticle.comments[0].id}`);
    expect(res.statusCode).toBe(200);
  });

  test(`DELETE /api/articles/falseArticleID/comments/trueCommentID: should be 404`, async () => {
    const res = await request(server)
      .delete(`/api/articles/${falseArticleId}/comments/${existingArticle.comments[0].id}`);
    expect(res.statusCode).toBe(404);
  });

  test(`DELETE /api/articles/trueArticleID/comments/falseCommentID: should be 404`, async () => {
    const res = await request(server)
      .delete(`/api/articles/${existingArticle.id}/comments/${falseCommentId}`);
    expect(res.statusCode).toBe(404);
  });

});
