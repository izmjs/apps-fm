const { model } = require('mongoose');

const App = model('ApplicationFM');

/**
 * List applications
 * @controller List
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.list = async function list(req, res, next) {
  const { $top: top = 10, $skip: skip = 0 } = req.query;
  try {
    const result = await App
      .find()
      .select({ alg: 0, secret: 0 })
      .paginate({ top, skip });
    return res.json(result);
  } catch (e) {
    return next(e);
  }
};

/**
 * Create new application
 * @controller Create
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.create = async function create(req, res, next) {
  const { body, user } = req;

  let app = new App({
    ...body,
    owner: user.id,
  });

  try {
    app = await app.save({ new: true });
    const secret = await app.regenerateKey();
    app = await app.save({ new: true });
    return res.json({
      ...app.toJSON(),
      secret,
    });
  } catch (e) {
    return next(e);
  }
};
