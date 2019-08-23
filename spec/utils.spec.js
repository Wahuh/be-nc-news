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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
