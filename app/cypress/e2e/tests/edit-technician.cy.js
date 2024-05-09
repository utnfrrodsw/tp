/// <reference types="cypress" />
import { login, interceptQuery } from '../../support/utils'
describe('Listar todos los técnicos que llegan desde BD', () => {
  beforeEach(() => {
    login()
    interceptQuery('technician1', 'technicians/1')
    cy.visit('/edit-technician/1')
  })
  it('Comprobar que se carguen los datos de la tarea en el formulario', () => {
    cy.wait('@gettechnicians/1', { timeout: 3000 })
    cy.get('@technician1Data').then((technician) => {
      const date = new Date(technician.date_born)
      const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()
      const month = date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1
      const formattedDate = `${day}/${month}/${date.getUTCFullYear()}`
      cy.get('[data-cy="technician-name"]').should('have.value', technician.name)
      cy.get('[data-cy="technician-birthdate"]').should('have.value', formattedDate)
    })
  })
  it('Comprobar modificación de datos', () => {
    cy.get('[data-cy="technician-name"]').type('Nombre')
    cy.get('[data-cy="technician-birthdate"]').invoke('val', 'Mon Feb 05 1990 00:00:00 GMT-0200')
    cy.get('[data-cy="save-technician"]').click()
    cy.wait('@gettechnicians/1').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })
  })
})