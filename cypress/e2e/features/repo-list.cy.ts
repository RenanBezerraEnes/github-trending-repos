describe('Repo List Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should display a list of repositories', () => {
    cy.get('[data-testid="repo-card"]').should('exist');
    cy.get('[data-testid="repo-card"]').its('length').should('be.gte', 1);
  });

  it('should display repo details in each card', () => {
    cy.get('[data-testid="repo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="repo-name"]').should('exist').and('not.be.empty');
        cy.get('[data-testid="repo-owner"]').should('exist').and('not.be.empty');
        cy.get('[data-testid="description"]').should('exist');
        cy.get('[data-testid="stats"]').should('exist');
      });
  });

  it('should load more repos on infinite scroll', () => {
    cy.get('[data-testid="repo-card"]').then(($cards) => {
      const initialCount = $cards.length;
      cy.scrollTo('bottom');
      cy.wait(1000);
      cy.get('[data-testid="repo-card"]').its('length').should('be.gt', initialCount);
    });
  });
});
