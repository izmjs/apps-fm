const SCOPE = 'apps-fm';

module.exports = (config) => {
  const { env } = config.utils;

  return {
    appsFm: {
      secretLength: env.get('SECRET_KEY_LENGTH', SCOPE),
      hashAlgo: env.get('HASH_ALGORITHM', SCOPE),
    },
  };
};
