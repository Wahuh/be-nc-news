const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { handle400Errors, handle404Errors } = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use(handle400Errors);
app.use(handle404Errors);

module.exports = app;
