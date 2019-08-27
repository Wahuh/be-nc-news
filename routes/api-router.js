const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
