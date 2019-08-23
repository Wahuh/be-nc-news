const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.deep.equal(expected);
  });

  it("returns an array with one object containing the unix timestamp converted to a Date object when passed an array with a single object", () => {
    const input = [{ created_at: 1481662720516 }];
    const [{ created_at }] = formatDates(input);
    const expected = new Date(1481662720516);
    expect(created_at).to.deep.equal(expected);
  });

  it("returns an array with multiple objects containing the unix timestamp converted to a Date object when passed an array with multiple objects", () => {
    const input = [
      { created_at: 1481662720516 },
      { created_at: 1502921310430 }
    ];

    const actual = formatDates(input);
    const expected = [
      { created_at: new Date(1481662720516) },
      { created_at: new Date(1502921310430) }
    ];
    expect(actual).to.deep.equal(expected);
  });

  it("does not mutate the input array", () => {
    const input = [{ created_at: 1481662720516 }];
    const copy = [{ created_at: 1481662720516 }];
    formatDates(input);
    expect(input).to.deep.equal(copy);
  });

  it("returns a new array", () => {
    const input = [{ created_at: 1481662720516 }];
    const actual = formatDates(input);
    expect(actual).to.be.an("array");
    expect(actual).to.not.equal(input);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.deep.equal(expected);
  });

  it("returns a reference object with a key and value when passed an array with one article object", () => {
    const input = [
      { article_id: 1, title: "Living in the shadow of a great man" }
    ];
    const actual = makeRefObj(input);
    const expected = { "Living in the shadow of a great man": 1 };
    expect(actual).to.deep.equal(expected);
  });

  it("returns a reference object with multiple key values when passed an array with multiple articles", () => {
    const input = [
      { article_id: 1, title: "Living in the shadow of a great man" },
      { article_id: 2, title: "What to Cook This Week" }
    ];
    const actual = makeRefObj(input);
    const expected = {
      "Living in the shadow of a great man": 1,
      "What to Cook This Week": 2
    };
    expect(actual).to.deep.equal(expected);
  });

  it("does not mutate the input array", () => {
    const input = [
      { article_id: 1, title: "Living in the shadow of a great man" }
    ];
    const copy = [
      { article_id: 1, title: "Living in the shadow of a great man" }
    ];
    formatDates(input);
    expect(input).to.deep.equal(copy);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array and ref object", () => {
    const comments = [];
    const actual = formatComments(comments);
    const expected = [];
    expect(actual).to.deep.equal(expected);
  });

  it("renames the created_by key to author", () => {
    const author = "butter_bridge";
    const article_id = 2;
    const ref = { "Living in the shadow of a great man": article_id };

    const comments = [
      { created_by: author, belongs_to: "Living in the shadow of a great man" }
    ];
    const [comment] = formatComments(comments, ref);
    expect(comment.author).to.equal(author);
  });

  it("renames the belongs_to key to article_id", () => {
    const comments = [{ belongs_to: "Living in the shadow of a great man" }];
    const article_id = 2;
    const ref = { "Living in the shadow of a great man": article_id };
    const [comment] = formatComments(comments, ref);
    expect(comment.hasOwnProperty("article_id")).to.be.true;
  });

  it("sets article_id to the corresponding title value from the reference object", () => {
    const comments = [{ belongs_to: "Living in the shadow of a great man" }];
    const article_id = 2;
    const ref = { "Living in the shadow of a great man": article_id };
    const [comment] = formatComments(comments, ref);
    expect(comment.article_id).to.equal(article_id);
  });

  it("converts the created_at property to a Date object", () => {
    const comments = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_at: 1511354163389
      }
    ];
    const article_id = 2;
    const ref = { "Living in the shadow of a great man": article_id };

    const [comment] = formatComments(comments, ref);
    expect(comment.created_at).to.deep.equal(new Date(1511354163389));
  });

  it("maintains the rest of the comment's properties", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "Living in the shadow of a great man": 2 };

    const [{ author, article_id, created_at, ...rest }] = formatComments(
      comments,
      ref
    );
    expect(rest).to.deep.equal({
      votes: 16,
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
    });
  });

  it("handles multiple comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const ref = {
      "Living in the shadow of a great man": 2,
      "They're not exactly dogs, are they?": 3
    };

    const actual = formatComments(comments, ref);
    expect(actual).to.deep.equal([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 3,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ]);
  });

  it("does not mutate the comments array", () => {
    const comments = [{ created_by: "butter_bridge" }];
    const copy = [{ created_by: "butter_bridge" }];
    formatDates(comments);
    expect(comments).to.deep.equal(copy);
  });

  it("returns a new array", () => {
    const comments = [{ created_by: "butter_bridge" }];
    const actual = formatDates(comments);
    expect(actual).to.be.an("array");
    expect(actual).to.not.equal(comments);
  });
});
