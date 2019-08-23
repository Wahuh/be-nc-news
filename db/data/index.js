const ENV = process.env.NODE_ENV || "development";

const testData = require("./data/test-data");
const developmentData = require("./data/development-data");

const data = {
  test: testData,
  development: developmentData
};

module.exports = data[ENV];
