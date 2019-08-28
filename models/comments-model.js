const connection = require("../db/connection");

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

module.exports = { insertComment };
