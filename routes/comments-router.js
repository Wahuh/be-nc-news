const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/comment-controller");
const { handle405Errors } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405Errors);

module.exports = commentsRouter;
