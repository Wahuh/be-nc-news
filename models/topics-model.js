const connection = require("../db/connection");

const selectTopics = () => {
  return connection.select("slug", "description").from("topics");
};

const topicExists = slug => {
  if (slug) {
    return connection("topics")
      .where({ slug })
      .first()
      .then(exists => {
        if (!exists) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }
      });
  } else {
    return Promise.resolve();
  }
};

module.exports = { selectTopics, topicExists };
