const apiData = require("../endpoints.json");

const getApi = (req, res, next) => {
  res.status(200).json({ api: apiData });
};

module.exports = { getApi };
