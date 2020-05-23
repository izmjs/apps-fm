/**
 * Module dependencies.
 */
const { Schema, model } = require('mongoose');
const { randomBytes, createHmac, getHashes } = require('crypto');
const { promisify } = require('util');
const { lib, appsFm } = require('@config/index');

const { timestamps } = lib.mongoose;
const { secretLength, hashAlgo } = appsFm;

const randomBytes$ = promisify(randomBytes);

const AppSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  secret: {
    type: String,
  },
  iams: [{
    type: String,
    required: true,
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  alg: {
    type: String,
    enum: getHashes(),
  },
}, {
  timestamps,
  collection: 'fm-applications',
});

AppSchema.methods.regenerateKey = async function regenerateKey() {
  const key = (await randomBytes$(secretLength)).toString('hex');
  const secret = createHmac(hashAlgo, this.id)
    .update(key)
    .digest('base64')
    .toString();

  this.set('secret', secret);
  this.set('alg', hashAlgo);

  return key;
};

module.exports = model('ApplicationFM', AppSchema);
