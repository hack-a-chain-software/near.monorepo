describe("hero test", () => {
  beforeEach(function () {
    cy.visit("/home");
  });

  it("passes", () => {
    cy.get(".title").contains("Near Monorepo");
  });
});
