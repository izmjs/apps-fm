// eslint-disable-next-line import/no-unresolved
const { validate } = require('utils');

const ctrls = require('../controllers/main.server.controller');
const createSchema = require('../schemas/app-create.server.schema');

/**
* @type { IAM.default }
*/
module.exports = {
  prefix: '/apps-fm',
  routes: [{
    path: '/',
    methods: {
      /**
       * @params
       * [{
       *   "key": "$top",
       *   "value": "10",
       *   "description": "Number of records to return"
       * }, {
       *   "key": "$skip",
       *   "value": "0",
       *   "description": "Number of records to skip"
       * }]
       */
      get: {
        iam: 'modules:apps-fm:main:list',
        title: 'List applications',
        parents: ['modules:apps-fm', 'modules:apps-fm:main'],
        groups: [],
        description: 'List and navigate through applications',
        middlewares: [
          ctrls.list,
        ],
      },
      /**
       * @body
       * {
       *   "name": "New application",
       *   "iams": ["modules:apps-fm"]
       * }
       */
      post: {
        iam: 'modules:apps-fm:main:create',
        title: 'Create application',
        parents: ['modules:apps-fm', 'modules:apps-fm:main'],
        groups: [],
        description: 'Create new application',
        middlewares: [
          validate(createSchema),
          ctrls.create,
        ],
      },
    },
  }],
};
