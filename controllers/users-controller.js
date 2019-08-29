const { selectUserByUsername } = require("../models/users-model");

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(({ username }))
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(next);
};

module.exports = { getUserByUsername };
