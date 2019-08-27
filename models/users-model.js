const connection = require("../db/connection");

const selectUserByUsername = username => {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where({ username })
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: "User not found" });
      return user;
    });
};

module.exports = { selectUserByUsername };
