const getPagination = (queryLimit, queryPage) => {
  const limit = Math.min(Math.max(parseInt(queryLimit) || 10, 1), 100);
  const page = Math.max(parseInt(queryPage) || 1, 1);
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take, page, limit };
};

module.exports = { getPagination };
