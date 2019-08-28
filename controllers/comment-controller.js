const {
  insertComment,
  selectCommentsByArticleId
} = require("../models/comments-model");

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then(comment => {
      res.status(201).json({ comment });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then(comments => {
      res.status(200).json({ comments });
    })
    .catch(next);
};

module.exports = { postComment, getCommentsByArticleId };
