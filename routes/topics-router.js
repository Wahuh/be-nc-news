const { getTopics } = require("../controllers/topics-controller");

const topicsRouter = require("express").Router();
const { handle405Errors } = require("../errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
