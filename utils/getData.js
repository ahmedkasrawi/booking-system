const getData = async (req, filter, Model, populateOptions = null) => {
  const limit = Number.parseInt(req.query.limit) || 10;
  const page = Number.parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  let query = Model.find(filter, { __v: 0 })
    .sort("-createdAt")
    .limit(limit)
    .skip(skip);
  if (populateOptions) {
    query = query.populate(populateOptions);
  }
  const [data, totalData] = await Promise.all([
    query,
    Model.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalData / limit);
  const pagination = {
    totalData,
    totalPages,
    isNextPage: page < totalPages,
    isPreviousPage: page > 1,
    currentPage: page,
  };

  return [data, pagination];
};

module.exports = getData;
