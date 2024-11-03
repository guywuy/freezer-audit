import { nameToSlug, validateUsername } from "./utils";

test("validateUsername returns false for non-strings", () => {
  expect(validateUsername(undefined)).toBe(false);
  expect(validateUsername(null)).toBe(false);
});

test("validateUsername returns true for whitelisted username", () => {
  expect(validateUsername("dontworry")).toBe(true);
});

test("nameToSlug transforms a category name to its slug", () => {
  expect(nameToSlug("Fruit and Veg")).toBe("FruitandVeg");
});
