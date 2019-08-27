process.env.NODE_ENV = "test";

const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const { expect } = require("chai");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });

  describe("/topics", () => {
    describe("GET", () => {
      it("status 200: returns an object with a topics key containing an array of objects with slug and description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            const { topics } = response.body;
            const [topic] = topics;
            expect(topic).to.have.all.keys(["slug", "description"]);
          });
      });
    });
  });

  describe("/users", () => {
    describe("/:username", () => {
      it("status 200: returns an object with a user key containing an object with username, avatar_url and name properties", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then(response => {
            const { user } = response.body;
            expect(user).to.have.all.keys(["username", "avatar_url", "name"]);
          });
      });
    });
  });
});
