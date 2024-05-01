/// <reference types="cypress" />

describe('Listar todos los técnicos que llegan desde BD', () => {
  const login = () => {
    Cypress.config('defaultCommandTimeout', 55000)
    cy.login(Cypress.env('userEmail'), Cypress.env('userPassword'))
  }
  beforeEach(() => {
    login()
    cy.fixture('technicians.json').as('techniciansData').then((res) => {
      cy.intercept('**/technicians*', (req) => {
        req.reply(res)
      }).as('getTechnicians')
    })
    cy.visit('/list-technicians')
  })
  it('Comprobar que se listan todos los técnicos en la tabla', () => {
    cy.wait('@getTechnicians', { timeout: 3000 })
    cy.get('@techniciansData').then((technicians) => {
      cy.get('tbody > tr').should('have.length', technicians.items.length)
      technicians.items.forEach((technician, index) => {
        cy.get(`tbody > tr:nth-child(${index + 1})`).within(() => {
          const date = new Date(technician.date_born)
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          cy.get('td:nth-child(1)').should('contain.text', technician.id)
          cy.get('td:nth-child(2)').should('contain.text', technician.name)
          cy.get('td:nth-child(3)').should('contain.text', formattedDate)
        })
      })
    })
  })
  it('Buscar técnico por nombre', () => {
    const searchTerm = 'Carlos'
    cy.get('[data-cy="search-input"]').type(searchTerm)
    cy.get('[data-cy="search-button"]').click()
    cy.intercept('GET', '**/technicians?name=' + searchTerm + '&*')
  })
})