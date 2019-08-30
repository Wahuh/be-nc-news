const connection = require("../db/connection");
const { topicExists } = require("./topics-model");
const { userExists } = require("./users-model");

const selectArticles = query => {
  const { sort_by, order, author, topic, p, limit } = query;

  if (limit) {
    if (isNaN(limit)) {
      return Promise.reject({ status: 400, msg: "Invalid limit query" });
    }
  }

  if (order) {
    if (order === "asc" || order === "desc") {
    } else {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  }
  const promises = [
    topicExists({ slug: topic }),
    userExists({ username: author })
  ];
  return Promise.all(promises)
    .then(() => {
      const articlesPromise = connection
        .select("articles.*")
        .modify(query => {
          if (author) {
            query.where({ "articles.author": author });
          }
          if (topic) {
            query.where({ "articles.topic": topic });
          }
        })
        .from("articles")
        .leftJoin("comments", { "articles.article_id": "comments.article_id" })
        .count("comments.article_id", { as: "comment_count" })
        .groupBy("articles.article_id")
        .limit(limit || 10)
        .offset((p - 1) * (limit || 10))
        .orderBy(sort_by || "created_at", order || "desc");

      const countPromise = connection("articles").count("article_id", {
        as: "total_count"
      });

      return Promise.all([articlesPromise, countPromise]);
    })
    .then(([articles, [{ total_count }]]) => {
      return { articles, total_count };
    });
};

const selectArticleById = ({ article_id }) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article id" });
  }
  return connection
    .select("articles.*")
    .from("articles")
    .where({ "articles.article_id": article_id })
    .leftJoin("comments", { "articles.article_id": "comments.article_id" })
    .count("comments.article_id", { as: "comment_count" })
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });

      return article;
    });
};

const updateArticle = ({ body, article_id }) => {
  const { inc_votes } = body;

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article id" });
  }
  if (inc_votes && isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
  }

  return connection("articles")
    .where({ article_id })
    .increment({ votes: inc_votes || 0 })
    .returning("*")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });
      else {
        return article;
      }
    });
};

module.exports = { selectArticles, selectArticleById, updateArticle };
