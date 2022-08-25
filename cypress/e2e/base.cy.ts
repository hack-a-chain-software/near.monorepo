describe("hero test", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get(".title").contains("Near Monorepo");
  });
});
