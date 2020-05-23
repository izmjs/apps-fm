const request = require('supertest');
const { model, connection } = require('mongoose');
const { createUser } = require('@helpers/utils');
const express = require('@config/lib/express');
const { prefix } = require('@config/index').app;

const {
  it,
  before,
  describe,
  afterEach,
} = require('mocha');

const User = model('User');

let app;
const credentials = {
  username: 'username',
  password: 'jsI$Aw3$0m3',
};
let agent;

/**
 * Sections tests
 */
describe('tests for module "modules:apps-fm"', () => {
  before(async () => {
    // Get application
    app = await express.init(connection.db);
    agent = request.agent(app);
  });

  describe('"modules:apps-fm" is up', () => {
    it('I am not allowed to call the API if I do not have the IAM "modules:apps-fm:ok"', async () => {
      await createUser(credentials, []);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      await agent.get(`${prefix}/apps-fm`).expect(403);
    });

    it('I am allowed to call the API if I have the IAM "modules:apps-fm:ok"', async () => {
      await createUser(credentials, [
        'modules:apps-fm:main:list',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      await agent.get(`${prefix}/apps-fm`).expect(200);
    });
  });

  afterEach(async () => {
    await Promise.all([
      User.remove(),
    ]);
  });
});
