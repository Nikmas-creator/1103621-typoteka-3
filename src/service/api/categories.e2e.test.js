'use strict';

const request = require(`supertest`);
const {init} = require(`../cli/server`);
let server;

describe(`Categories API end-points`, () => {
  beforeAll(async () => {
    server = await init();
  });

  test(`GET /api/categories: should be 200`, async () => {
    const res = await request(server).get(`/api/categories`);
    expect(res.statusCode).toBe(200);
  })
});