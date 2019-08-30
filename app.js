const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handle400Errors,
  handle404Errors,
  handle422Errors,
  handleRouteNotFound
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", handleRouteNotFound);
app.use(handle400Errors);
app.use(handle404Errors);
app.use(handle422Errors);

module.exports = app;
