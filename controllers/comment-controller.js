const { insertComment } = require("../models/comments-model");

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then(comment => {
      res.status(201).json({ comment });
    })
    .catch(next);
};

module.exports = { postComment };
