describe("hero test", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get(".w3-animate-bottom").contains("Near Monorepo");
  });
});
