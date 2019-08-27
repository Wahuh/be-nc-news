const { topicData, articleData, commentData, userData } = require("../data");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex
        .insert(topicData)
        .into("topics")
        .returning("*");
      const usersInsertions = knex
        .insert(userData)
        .into("users")
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions])
        .then(([topics, users]) => {
          const formattedArticleData = formatDates(articleData);
          return knex
            .insert(formattedArticleData)
            .into("articles")
            .returning("*");
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          return knex("comments").insert(formattedComments);
        });
    });
};
