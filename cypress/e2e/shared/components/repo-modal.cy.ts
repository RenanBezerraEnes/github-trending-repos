describe('Repo Modal Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
    cy.get('[data-testid="repo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="repo-name"]').click();
      });

    cy.get('[data-testid="repo-modal"]').should('exist');
  });

  it('should display full repo information', () => {
    cy.get('[data-testid="repo-modal"]').within(() => {
      cy.get('[data-testid="modal-title"]').should('not.be.empty');
      cy.get('[data-testid="modal-avatar"]').should('be.visible');
      cy.get('[data-testid="modal-description"]').should('contain.text', 'Description');
      cy.get('[data-testid="modal-stats"]').within(() => {
        cy.get('mat-chip').should('have.length', 2);
        cy.get('mat-icon').contains('star').should('exist');
        cy.get('mat-icon').contains('bug_report').should('exist');
      });
      cy.get('[data-testid="modal-created"]').should('contain.text', 'Created:');
    });
  });

  it('should update rating when stars are clicked', () => {
    cy.get('[data-testid="modal-rating"] mat-icon').eq(2).click().wait(300);

    cy.get('[data-testid="modal-rating"] mat-icon.filled').should('have.length', 3);

    cy.get('mat-dialog-actions button').click();
    cy.get('[data-testid="repo-modal"]').should('not.exist');
  });

  it('should close the modal when the close button is clicked', () => {
    cy.get('mat-dialog-actions button').click();
    cy.get('[data-testid="repo-modal"]').should('not.exist');
  });
});
