describe('Repo Card Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
    cy.get('[data-testid="repo-card"]').first().as('card');
  });

  it('should render the repo card with all required info', () => {
    cy.get('@card').within(() => {
      cy.get('[data-testid="repo-avatar"]').should('be.visible');
      cy.get('[data-testid="repo-name"]').should('exist').and('not.be.empty');
      cy.get('[data-testid="repo-owner"]').should('contain.text', 'by');
      cy.get('[data-testid="description"]').should('exist');
      cy.get('[data-testid="stars"]').should('contain.text', 'star');
      cy.get('[data-testid="issues"]').should('contain.text', 'bug_report');
      cy.get('[data-testid="created-date"]').should('exist');
    });
  });

  it('should display a clickable repo name that opens a modal', () => {
    cy.get('@card').within(() => {
      cy.get('[data-testid="repo-name"]').click();
    });

    cy.get('mat-dialog-container').should('exist');
    cy.get('mat-dialog-container').within(() => {
      cy.contains('Description:').should('exist');
      cy.get('mat-icon').contains('star').should('exist');
      cy.contains('Created:').should('exist');
    });
  });
});
