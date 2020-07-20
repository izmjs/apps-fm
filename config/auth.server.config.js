const { model } = require('mongoose');

const Model = model('ApplicationFM');
const User = model('User');

module.exports = (app) => {
  app.use(async (req, res, next) => {
    const xClientId = req.get('x-client-id');
    const xSecretKey = req.get('x-secret-key');

    if (!xClientId || !xSecretKey) {
      return next();
    }

    let application;

    try {
      application = await Model.findById(xClientId);
    } catch (e) {
      return next(e);
    }

    if (!application || !application.isKeyValid(xSecretKey)) {
      return res.status(401).json({
        message: req.t('Invalid application'),
      });
    }

    const { iams = [], owner } = application;
    req.iams = iams;

    try {
      req.user = await User.findById(owner);
    } catch (e) {
      return next(e);
    }

    return next();
  });
};
