const connection = require("../db/connection");

const selectCommentsByArticleId = (article_id, query) => {
  const { sort_by, order } = query;
  if (order) {
    if (order === "asc" || order === "desc") {
    } else {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  }

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
          .where({ article_id })
          .orderBy(sort_by || "created_at", order || "desc");
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

const updateComment = (comment_id, body) => {
  const { inc_votes } = body;
  if (isNaN(+inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid body parameter inc_votes"
    });
  }
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment_id"
    });
  }
  return connection("comments")
    .where({ comment_id })
    .increment({ votes: inc_votes })
    .returning("*")
    .then(([comment]) => {
      if (comment) {
        return comment;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Comment not found"
        });
      }
    });
};

const removeComment = comment_id => {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment_id"
    });
  }
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found"
        });
      } else {
        return deleteCount;
      }
    });
};

module.exports = {
  insertComment,
  selectCommentsByArticleId,
  updateComment,
  removeComment
};
