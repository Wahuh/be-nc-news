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

articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
