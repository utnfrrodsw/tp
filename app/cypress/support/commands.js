// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('login', (email, password) => {
  Cypress.config('defaultCommandTimeout', 10000)
  cy.session('sessionLogin', () => {
    cy.visit('/login')
    cy.get('[data-cy="input-correo"]').type(email)
    cy.get('[data-cy="input-contrasena"]').type(password)
    cy.get('[data-cy="login-button"]').click()
    cy.intercept('POST', '**/login*').as('login')
    cy.wait('@login', { timeout: 15000 })
  })
})