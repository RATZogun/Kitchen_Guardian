describe('Testes Guardião da Cozinha', () => {
  
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('Acessar o sistema e iniciar gravador', () => {
    cy.visit('http://localhost:3000/');
    cy.get('#root button.rounded').click();
    cy.get('#root input[maxlength="60"]').click();
    cy.get('#root input[maxlength="60"]').type('Laticinios');
    cy.get('#root textarea.border').click();
    cy.get('#root textarea.border').type('Leites e derivados');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root p.border').should('be.visible');
  });
  
});