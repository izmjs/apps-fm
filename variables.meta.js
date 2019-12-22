const { getHashes } = require('crypto');

module.exports = {
  SECRET_KEY_LENGTH: {
    name: 'The secret key length',
    defaultValue: 64,
    scope: 'apps-fm',
    schema: {
      type: 'integer',
    },
  },
  HASH_ALGORITHM: {
    name: 'Hashing algorithm',
    defaultValue: 'sha256',
    scope: 'apps-fm',
    schema: {
      type: 'string',
      enum: getHashes(),
    },
  },
};
