const sendSuccess = (res, statusCode, message, data = null, meta = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, details = null) => {
  const response = { success: false, message };
  if (details !== null) response.error = details;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
