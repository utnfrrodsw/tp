export const login = () => {
  Cypress.config('defaultCommandTimeout', 55000)
  cy.login(Cypress.env('userEmail'), Cypress.env('userPassword'))
}
export const interceptQuery = (jsonName, queryName) => {
  cy.fixture(jsonName + '.json').as(jsonName + 'Data').then((res) => {
    cy.intercept('**/' + queryName + '*', (req) => {
      req.reply(res)
    }).as('get' + queryName)
  })
}