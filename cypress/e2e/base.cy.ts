describe("hero test", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");

    cy.get(".w3-animate-bottom").contains("Near Monorepo");
  });
});
