const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const { expect } = require("chai");

describe("/api", () => {
  after(() => {
    connection.destroy();
  });

  describe("/topics", () => {
    describe("GET", () => {
      it("status 200: returns an array of topic objects with slug and description properties", () => {
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
});
