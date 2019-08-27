const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle
} = require("../controllers/articles-controller");
const { postComment } = require("../controllers/comment-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
