const { HttpError } = require('../http/http-error');

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(new HttpError(400, 'Validation Error', 'VALIDATION_FAILED', error.issues || error.errors));
  }
};

module.exports = { validateRequest };
