process.env.NODE_ENV = "test";

const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    describe("GET", () => {
      it("status 200: returns an array of topic objects with slug and description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            const { topics } = response.body;
            expect(topics).to.be.an("array");
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
  });

  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("status 200: returns a user object with username, avatar_url and name properties", () => {
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
    describe("GET", () => {
      it("status 200: returns an array of article objects which have specific properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.an("array");
            const [article] = articles;
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "body",
              "comment_count"
            ]);
          });
      });

      it("status 200: returns an array of article objects sorted by created_at in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.descendingBy("created_at");
          });
      });

      it("status 200: returns an array of article objects sorted by a sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            const commentCountToNumber = articles.map(article => ({
              ...article,
              comment_count: +article.comment_count
            }));
            expect(commentCountToNumber).to.be.descendingBy("comment_count");
          });
      });

      it("status 200: returns an array of article objects sorted by created_at in the order specified by the query", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.be.ascendingBy("created_at");
          });
      });

      it("status 200: returns an array of article objects filtered by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            const shouldHaveSameAuthor = articles.every(
              ({ author }) => author === "butter_bridge"
            );
            expect(shouldHaveSameAuthor).to.be.true;
          });
      });

      it("status 200: returns an array of article objects filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            const shouldHaveSameTopic = articles.every(
              ({ topic }) => topic === "mitch"
            );
            expect(shouldHaveSameTopic).to.be.true;
          });
      });

      it("status 200: returns an empty array if there are no articles with the author query", () => {
        return request(app)
          .get("/api/articles?author=jimbo")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.deep.equal([]);
          });
      });

      it("status 200: returns an empty array if there are no articles with the topic query", () => {
        return request(app)
          .get("/api/articles?topic=bananas")
          .expect(200)
          .then(response => {
            const { articles } = response.body;
            expect(articles).to.deep.equal([]);
          });
      });

      it("status 400: returns an error message if sort_by is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Invalid query parameter");
          });
      });

      it("status 400: returns an error message if order is invalid", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Invalid order query");
          });
      });
    });

    describe("INVALID METHODS", () => {
      it("status 405: returns an object with an error message when client uses an invalid method", () => {
        const methods = ["patch", "post", "delete", "put"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(promises);
      });
    });
    
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
      });

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

        describe("GET", () => {
          it("status 200: returns an array of comment objects which have comment_id, votes, created_at, author and body properties", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                const { comments } = response.body;
                expect(comments).to.be.an("array");
                const [comment] = comments;
                expect(comment).to.have.all.keys([
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                ]);
              });
          });

          it("status 200: returns an array of comment objects, sorted by created_at in descending order by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                const { comments } = response.body;
                expect(comments).to.be.descendingBy("created_at");
              });
          });

          it("status 200: returns an array of comment objects sorted by a sort_by query column", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(response => {
                const { comments } = response.body;
                expect(comments).to.be.descendingBy("votes");
              });
          });

          it("status 200: returns an array of comment objects in an order specified by the query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(response => {
                const { comments } = response.body;
                expect(comments).to.be.ascendingBy("created_at");
              });
          });

          it("status 400: returns an error message if the article_id is invalid", () => {
            return request(app)
              .get("/api/articles/hello/comments")
              .expect(400)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Invalid article id");
              });
          });

          it("status 400: returns an error message if sort_by is invalid", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=invalid")
              .expect(400)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Invalid query parameter");
              });
          });

          it("status 400: returns an error message if order is invalid", () => {
            return request(app)
              .get("/api/articles/1/comments?order=invalid")
              .expect(400)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Invalid order query");
              });
          });

          it("status 404: returns an error message if the article_id does not exist", () => {
            return request(app)
              .get("/api/articles/9000/comments")
              .expect(404)
              .then(response => {
                const { msg } = response.body;
                expect(msg).to.equal("Article not found");
              });
          });
        });

        describe("INVALID METHODS", () => {
          it("status 405: returns on object with an error message when client uses an invalid method", () => {
            const methods = ["patch", "delete", "put"];
            const promises = methods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
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
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("status 200: returns an updated comment object with the expected properties", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
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

        it("status 200: returns an updated comment object with incremented votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 200 })
            .expect(200)
            .then(response => {
              const { comment } = response.body;

              expect(comment.votes).to.equal(216);
            });
        });

        it("status 200: returns an updated comment object with decremented votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -200 })
            .expect(200)
            .then(response => {
              const { comment } = response.body;

              expect(comment.votes).to.equal(-184);
            });
        });

        it("status 400: returns an error message if inc_votes is invalid", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(response => {
              const { msg } = response.body;

              expect(msg).to.equal("Invalid body parameter inc_votes");
            });
        });

        it("status 400: returns an error message if comment_id is invalid", () => {
          return request(app)
            .patch("/api/comments/hello")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(response => {
              const { msg } = response.body;

              expect(msg).to.equal("Invalid comment_id");
            });
        });

        it("status 404: returns an error message if comment_id does not exist", () => {
          return request(app)
            .patch("/api/comments/9000")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(response => {
              const { msg } = response.body;

              expect(msg).to.equal("Comment not found");
            });
        });
      });

      describe("DELETE", () => {
        it("status 204: no content when a comment is successfully deleted", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });

        it("status 400: returns an error message when the comment_id is invalid", () => {
          return request(app)
            .delete("/api/comments/hello")
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Invalid comment_id");
            });
        });

        it("status 404: returns an error message when the comment_id does not exist", () => {
          return request(app)
            .delete("/api/comments/9000")
            .expect(404)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal("Comment not found");
            });
        });
      });

      describe("INVALID METHODS", () => {
        it("status 405: returns an object with an error message when client uses an invalid method", () => {
          const methods = ["get", "post", "put"];
          const promises = methods.map(method => {
            return request(app)
              [method]("/api/comments/1")
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
});
