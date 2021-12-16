const url = 'http://localhost:3000/';

describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit(url);
  });

  it('Successfully logs in', () => {
    validateSignInPage();
    cy.get('#email').should('be.visible').type('brent.champion@queensu.ca');
    cy.get('#password').should('be.visible').type('Lions@1080');
    cy.get('button[type="submit"]').should('be.visible').click();
  });

  it('Successfully creates an account', () => {
    validateSignInPage();
    cy.get('a').eq(1).click();
    validateCreateAccountPage();
    cy.get('#firstName').should('be.visible').type('Brent');
    cy.get('#lastName').should('be.visible').type('Champion');
    cy.get('#studentNumber').should('be.visible').type('12345678');
    cy.get('#email').should('be.visible').type('16bc39@queensu.ca');
    cy.get('#password').should('be.visible').type('Lions@1080');
    cy.get('#userType').should('be.visible').select('Sci Formal Committee');
    cy.get('button[type="submit"]').should('be.visible').click();
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

const validateCreateAccountPage = () => {
  cy.contains('Create An Account');
  cy.contains('First Name');
  cy.contains('Last Name');
  cy.contains('Student Number');
  cy.contains('Email');
  cy.contains('Password');
  cy.contains('User Type');
  cy.contains('Register');
};
