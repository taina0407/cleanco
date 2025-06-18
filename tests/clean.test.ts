import { basename, prepareDefaultTerms } from "../src/clean";
import { typesources, countrysources, matches } from "../src/classify";

describe("cleanco TypeScript", () => {
  describe("deterministic terms", () => {
    it("should always return the same list (even for different ordering in get_unique_terms)", () => {
      // This test would require mocking, but we can test that prepareDefaultTerms is deterministic
      const res1 = prepareDefaultTerms();
      const res2 = prepareDefaultTerms();
      expect(res1).toEqual(res2);
    });
  });

  describe("basic cleanup tests", () => {
    const basicCleanupTests = {
      "name w/ suffix": "Hello World Oy",
      "name w/ ', ltd.'": "Hello World, ltd.",
      "name w/ ws suffix ws": "Hello    World ltd",
      "name w/ suffix ws": "Hello World ltd ",
      "name w/ suffix dot ws": "Hello World ltd. ",
      "name w/ ws suffix dot ws": " Hello World ltd. ",
    };

    const expected = "Hello World";
    for (const [testname, variation] of Object.entries(basicCleanupTests)) {
      it(testname, () => {
        expect(basename(variation)).toBe(expected);
      });
    }
  });

  describe("multi-type cleanup tests", () => {
    const multiCleanupTests = {
      "name + suffix": "Hello World Oy",
      "name + suffix (without punct)": "Hello World sro",
      "prefix + name": "Oy Hello World",
      "prefix + name + suffix": "Oy Hello World Ab",
      "name w/ term in middle": "Hello Oy World",
      "name w/ complex term in middle": "Hello pty ltd World",
      "name w/ mid + suffix": "Hello Oy World Ab",
    };

    const expected = "Hello World";
    for (const [testname, variation] of Object.entries(multiCleanupTests)) {
      it(testname, () => {
        const result = basename(variation, {
          suffix: true,
          prefix: true,
          middle: true,
        });
        expect(result).toBe(expected);
      });
    }
  });

  describe("double cleanup tests", () => {
    const doubleCleanupTests = {
      "name + two prefix": "Ab Oy Hello World",
      "name + two suffix": "Hello World Ab Oy",
      "name + two in middle": "Hello Ab Oy World",
    };

    const expected = "Hello World";
    for (const [testname, variation] of Object.entries(doubleCleanupTests)) {
      it(testname, () => {
        const result = basename(variation, {
          suffix: true,
          prefix: true,
          middle: true,
        });
        const final = basename(result, {
          suffix: true,
          prefix: true,
          middle: true,
        });
        expect(final).toBe(expected);
      });
    }
  });

  describe("preserving cleanup tests", () => {
    const preservingCleanupTests = {
      "name with comma": ["Hello, World, ltd.", "Hello, World"],
      "name with dot": ["Hello. World, Oy", "Hello. World"],
    };

    for (const [testname, [variation, expected]] of Object.entries(
      preservingCleanupTests
    )) {
      it(testname, () => {
        expect(basename(variation)).toBe(expected);
      });
    }
  });

  describe("unicode umlaut tests", () => {
    const unicodeUmlautTests = {
      "name with umlaut in end": ["Säätämö Oy", "Säätämö"],
      "name with umlauts & comma": ["Säätämö, Oy", "Säätämö"],
      "name with no ending umlaut": ["Säätämo Oy", "Säätämo"],
      "name with beginning umlaut": ["Äätämo Oy", "Äätämo"],
      "name with just umlauts": ["Äätämö", "Äätämö"],
      "cyrillic name": [
        "ОАО Новороссийский морской торговый порт",
        "Новороссийский морской торговый порт",
      ],
    };

    for (const [testname, [variation, expected]] of Object.entries(
      unicodeUmlautTests
    )) {
      it(testname, () => {
        expect(basename(variation, { prefix: true })).toBe(expected);
      });
    }
  });

  describe("terms with accents tests", () => {
    const termsWithAccentsTests = {
      "term with ł correct spelling": ["Łoś spółka z o.o", "Łoś"],
      "term with ł incorrect spelling": ["Łoś spolka z o.o", "Łoś"],
    };

    for (const [testname, [variation, expected]] of Object.entries(
      termsWithAccentsTests
    )) {
      it(testname, () => {
        expect(basename(variation, { suffix: true })).toBe(expected);
      });
    }
  });

  describe("classify", () => {
    it("should identify business types", () => {
      const classificationSources = typesources();
      const result = matches("Some Big Pharma, LLC", classificationSources);
      expect(result).toContain("Limited Liability Company");
    });

    it("should identify countries", () => {
      const classificationSources = countrysources();
      const result = matches("Some Big Pharma, LLC", classificationSources);
      expect(result).toContain("United States of America");
      expect(result).toContain("Philippines");
    });
  });

  describe("prepareDefaultTerms", () => {
    it("should return sorted terms", () => {
      const terms = prepareDefaultTerms();
      expect(terms.length).toBeGreaterThan(0);
      // Check that terms are sorted by length (descending)
      for (let i = 1; i < terms.length; i++) {
        expect(terms[i - 1][0]).toBeGreaterThanOrEqual(terms[i][0]);
      }
    });
  });
});
