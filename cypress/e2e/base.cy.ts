describe("hero test", () => {
  beforeEach(function () {
    cy.visit("/");
  });

  it("passes", () => {
    cy.get(".title").contains("Near Monorepo");
  });
});
