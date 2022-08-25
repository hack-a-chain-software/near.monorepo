describe("hero test", () => {
  it("passes", () => {
    cy.visit("/").get(".title").contains("Near Monorepo");
  });
});
