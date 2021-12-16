const url = 'http://localhost:3000/';

describe('Authentication Tests', () => {
  // Login the user
  beforeEach(() => {
    cy.visit(url);
    validateSignInPage();
    cy.get('#email').should('be.visible').type('brent.champion@queensu.ca');
    cy.get('#password').should('be.visible').type('Lions@1080');
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.wait(5000);
  });

  it('takes you to the hours page', () => {
    cy.contains('My Hours');
  });
});

const validateSignInPage = () => {
  cy.contains('Sign In');
  cy.contains('Email');
  cy.contains('Password');
  cy.contains('Remember me');
  cy.contains('Forgot password?');
  cy.contains('Create an account');
};
