const connection = require("../db/connection");

const selectTopics = () => {
  return connection.select("slug", "description").from("topics");
};

module.exports = { selectTopics };
