const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle
} = require("../controllers/articles-controller");
const { postComment } = require("../controllers/comment-controller");
const { handle405Errors } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .all(handle405Errors);

module.exports = articlesRouter;
