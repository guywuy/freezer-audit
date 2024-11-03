import { faker } from "@faker-js/faker";

const locationTitle = "cellar";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      username: `test${faker.lorem.words(1)}`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ username: loginForm.username })).as("user");

    cy.visitAndCheck("/join");

    cy.findByRole("textbox", { name: /username/i }).type(loginForm.username);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /View Frozen Items for test/i }).click();
    cy.get("header [data-menu]").click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a location", () => {
    cy.login();

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /View Frozen Items for */i }).click();

    cy.get("header [data-menu]").click();
    cy.findByRole("link", { name: /freezer locations/i }).click();
    cy.findByText("No locations yet.");

    cy.get("#new").click();

    cy.findByRole("textbox", { name: /title/i }).type(locationTitle);
    cy.findByRole("button", { name: /save/i }).click();
  });

  // it("should allow you to make a item", () => {
  //   const testItem = {
  //     title: faker.lorem.words(1),
  //   };
  //   cy.login();

  //   cy.visitAndCheck("/");
  //   cy.findByRole("link", { name: /View Frozen Items for */i }).click();

  //   cy.findByRole("link", { name: //i }).click();
  // });
});
