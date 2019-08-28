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
    return connection.destroy();
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

    describe("INVALID METHODS", () => {
      it("status 405: returns on object with an error message when client uses an invalid method", () => {
        const methods = ["patch", "post", "delete", "put"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(promises);
      });
    });
    1;
  });

  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("status 200: returns an object with a user key containing an object with username, avatar_url and name properties", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(response => {
              const { user } = response.body;
              expect(user).to.have.all.keys(["username", "avatar_url", "name"]);
            });
        });

        it("status 404: returns an object with an error message", () => {
          return request(app)
            .get("/api/users/idonotexist")
            .expect(404)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("User not found");
            });
        });
      });

      describe("INVALID METHODS", () => {
        it("status 405: returns on object with an error message when client uses an invalid method", () => {
          const methods = ["patch", "post", "delete", "put"];
          const promises = methods.map(method => {
            return request(app)
              [method]("/api/users/lurker")
              .expect(405)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Invalid method");
              });
          });
          return Promise.all(promises);
        });
      });
    });
  });

  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET", () => {
        it("status 200: returns an object with an article key containing an object with specific properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              const { article } = response.body;
              expect(article).to.have.all.keys([
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ]);
            });
        });

        it("status 400: returns an object with an error message", () => {
          return request(app)
            .get("/api/articles/hello")
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Invalid article id");
            });
        });

        it("status 404: returns an object with an error message", () => {
          return request(app)
            .get("/api/articles/9000")
            .expect(404)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Article not found");
            });
        });
      });

      describe("PATCH", () => {
        it("status 200: returns an object with an article key containing an object with updated properties", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(response => {
              const { article } = response.body;
              expect(article).to.have.all.keys([
                "article_id",
                "author",
                "title",
                "body",
                "topic",
                "created_at",
                "votes"
              ]);
            });
        });

        it("status 200: handles incrementing votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 50 })
            .expect(200)
            .then(response => {
              const { article } = response.body;
              expect(article.votes).to.equal(150);
            });
        });

        it("status 200: handles decrementing votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -50 })
            .expect(200)
            .then(response => {
              const { article } = response.body;
              expect(article.votes).to.equal(50);
            });
        });

        // it("status 400: returns an object with an error message if votes will be decreased to less than 0", () => {
        //   return request(app)
        //     .patch("/api/articles/1")
        //     .send({ inc_votes: -10000 })
        //     .expect(400)
        //     .then(response => {
        //       const { msg } = response.body;
        //       expect(msg).to.equal("Article votes cannot go below 0");
        //     });
        // });

        it("status 400: returns an object with an error message if article id is not a number", () => {
          return request(app)
            .patch("/api/articles/notANumber")
            .send({ inc_votes: 50 })
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Invalid article id");
            });
        });

        it("status 400: returns an object with an error message if inc_votes is not a number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "notANumber" })
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("inc_votes must be a number");
            });
        });

        it("status 404: returns an object with an error message if article_id does not exist", () => {
          return request(app)
            .patch("/api/articles/9000")
            .send({ inc_votes: 50 })
            .expect(404)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Article not found");
            });
        });
      });

      describe("INVALID METHODS", () => {
        it("status 405: returns on object with an error message when client uses an invalid method", () => {
          const methods = ["post", "delete", "put"];
          const promises = methods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Invalid method");
              });
          });
          return Promise.all(promises);
        });
      })

      describe("/comments", () => {
        describe("POST", () => {
          it("status 201: returns an object with a key of comment containing the updated comment object", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "lurker", body: "Fantastic article" })
              .expect(201)
              .then(response => {
                const { comment } = response.body;
                expect(comment).to.have.all.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                ]);
              });
          });

          it("status 400: returns an error message if comment body is empty", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "lurker", body: "" })
              .expect(400)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("You can't post an empty comment!");
              });
          });

          it("status 400: returns an error message if username is empty", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "", body: "Fantastic article" })
              .expect(400)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal(
                  "You can't post a comment without a username!"
                );
              });
          });

          it("status 404: returns an error message if the article_id does not exist", () => {
            return request(app)
              .post("/api/articles/9000/comments")
              .send({ username: "lurker", body: "Fantastic article" })
              .expect(404)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Article not found");
              });
          });

          it("status 422: returns an error message if the username does not exist", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "Thanh", body: "Fantastic article" })
              .expect(422)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Unprocessable entity");
              });
          });
        });
      });
    });
  });
});
