const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controller");

usersRouter.use("/:username", getUserByUsername);

module.exports = usersRouter;
