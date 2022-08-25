describe("home", () => {
  beforeEach(function () {
    cy.visit("/");
  });

  it("passes", () => {
    cy.get(".header");
  });
});
