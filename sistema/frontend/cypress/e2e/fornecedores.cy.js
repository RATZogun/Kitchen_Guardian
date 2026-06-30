describe('Testes de Fornecedores', () => {
  
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('Iniciar Gravador', () => {
    cy.visit('http://localhost:3000/');
    cy.get('#root div.mx-auto button:nth-child(2)').click();
    cy.get('#root button.rounded').click();
    cy.get('#root input[maxlength="60"]').click();
    cy.get('#root input[maxlength="60"]').type('cemil');
    cy.get('#root input[maxlength="200"]').click();
    cy.get('#root input[maxlength="200"]').type('12345678999999999');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root p.border').should('be.visible');
  });
  
});