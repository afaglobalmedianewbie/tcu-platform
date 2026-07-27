const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('FATAL: JWT_SECRET MUST BE SET IN PRODUCTION');
  return secret;
};

module.exports = { getJwtSecret };
