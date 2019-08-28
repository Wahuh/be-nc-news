const connection = require("../db/connection");

const selectCommentsByArticleId = article_id => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article id" });
  }
  return connection("articles")
    .select("*")
    .where({ article_id })
    .then(([article]) => {
      if (article) {
        return connection("comments")
          .select("comment_id", "votes", "created_at", "author", "body")
          .where({ article_id });
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      }
    });
};

const insertComment = (reqBody, article_id) => {
  const { username, body } = reqBody;
  if (!body)
    return Promise.reject({
      status: 400,
      msg: "You can't post an empty comment!"
    });
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "You can't post a comment without a username!"
    });
  }

  return connection("articles")
    .select("*")
    .where({ article_id })
    .then(([article]) => {
      if (article) {
        return connection("comments")
          .insert({ body, author: username, article_id })
          .returning("*")
          .then(([comment]) => comment);
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      }
    });
};

module.exports = { insertComment, selectCommentsByArticleId };
