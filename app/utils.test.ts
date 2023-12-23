import { validateUsername } from "./utils";

test("validateUsername returns false for non-strings", () => {
  expect(validateUsername(undefined)).toBe(false);
  expect(validateUsername(null)).toBe(false);
});

test("validateUsername returns true for emails", () => {
  expect(validateUsername("customname")).toBe(true);
});
