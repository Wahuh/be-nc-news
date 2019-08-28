const {
  insertComment,
  selectCommentsByArticleId,
  updateComment
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
  selectCommentsByArticleId(article_id, req.query)
    .then(comments => {
      res.status(200).json({ comments });
    })
    .catch(next);
};

const patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  updateComment(comment_id, req.body)
    .then(comment => {
      res.status(200).json({ comment });
    })
    .catch(next);
};

module.exports = { patchComment, postComment, getCommentsByArticleId };
