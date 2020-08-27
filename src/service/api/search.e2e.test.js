'use strict';

const request = require(`supertest`);
const getMockData = require(`../lib/get-mock-data`);
const {init} = require(`../cli/server`);
let server;
let data;
let trueTitle;

describe(`Search API end-points`, () => {
  beforeAll(async () => {
    server = await init();
    data = await getMockData();
    trueTitle = data[0].title
  });

  const falseTitle = `ХЗХЗХЗ`;

  test(`GET /api/search?query=trueTitle: should be 200`, async () => {
    const res = await request(server).get(encodeURI(`/api/search?query=${trueTitle}`));
    expect(res.statusCode).toBe(200);
  });

  test(`GET /api/search?query=falseTitle: should be 404`, async () => {
    const res = await request(server).get(encodeURI(`/api/search?query=${falseTitle}`));
    expect(res.statusCode).toBe(404);
  });
});