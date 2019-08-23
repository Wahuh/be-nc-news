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

  it("returns a new array", () => {
    const input = [
      { article_id: 1, title: "Living in the shadow of a great man" }
    ];
    const actual = formatDates(input);
    expect(actual).to.be.an("array");
    expect(actual).to.not.equal(input);
  });
});

describe("formatComments", () => {});
