describe("empty spec", () => {
  it("passes", () => {
    cy.visit("localhost:3000");

    cy.get(".w3-animate-bottom").contains("Near Monorepo");
  });
});
