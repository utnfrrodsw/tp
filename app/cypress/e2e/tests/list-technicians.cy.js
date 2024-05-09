/// <reference types="cypress" />
import { login, interceptQuery } from '../../support/utils'
describe('Listar todos los técnicos que llegan desde BD', () => {
  beforeEach(() => {
    login()
    interceptQuery('technicians', 'technicians')
    cy.visit('/list-technicians')
  })
  it('Comprobar que se listan todos los técnicos en la tabla', () => {
    cy.wait('@gettechnicians', { timeout: 3000 })
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
  it('Hacer clic en el botón de editar técnico y validar la URL', () => {
    cy.wait('@gettechnicians', { timeout: 3000 })
    cy.get('@techniciansData').then((technician) => {
      const firstTechnicianId = technician.items[0].id
      const expectedUrl = `/edit-technician/${firstTechnicianId}`
      cy.get('tbody > tr:first-child')
        .find('td:nth-child(4) button')
        .click()
      cy.url().should('include', expectedUrl)
    })
  })
})