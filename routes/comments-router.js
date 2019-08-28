const commentsRouter = require("express").Router();
const { patchComment } = require("../controllers/comment-controller");
const { handle405Errors } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .all(handle405Errors);

module.exports = commentsRouter;
