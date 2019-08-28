const connection = require("../db/connection");

const selectArticles = query => {
  const { sort_by, order, author, topic } = query;
  if (order) {
    if (order === "asc" || order === "desc") {
    } else {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  }

  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .modify(query => {
      if (author) {
        query.where({ "articles.author": author });
      }
      if (topic) {
        query.where({ "articles.topic": topic });
      }
    })
    .from("articles")
    .join("comments", { "articles.article_id": "comments.article_id" })
    .count("comments.article_id", { as: "comment_count" })
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc");
};

const selectArticleById = article_id => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article id" });
  }
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .where({ "articles.article_id": article_id })
    .join("comments", { "articles.article_id": "comments.article_id" })
    .count("comments.article_id", { as: "comment_count" })
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });

      return article;
    });
};

const updateArticle = (body, article_id) => {
  const { inc_votes } = body;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article id" });
  }
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
  }

  return connection("articles")
    .where({ article_id })
    .increment({ votes: inc_votes })
    .returning("*")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

module.exports = { selectArticles, selectArticleById, updateArticle };
