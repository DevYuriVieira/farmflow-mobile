describe('FarmFlow E2E — Cypress Mobile & Web Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar a aplicação com sucesso e renderizar a viewport mobile', () => {
    cy.get('body').should('be.visible');
    cy.title().should('match', /Login|FarmFlow|Expo|React/i);
  });

  it('deve renderizar a estrutura visual do dashboard agro', () => {
    cy.get('#root').should('exist');
    cy.screenshot('cypress-dashboard-initial');
  });
});
