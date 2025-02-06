/// <reference types="cypress" />
import { login, interceptQuery } from '../../support/utils'
describe('Listar todos los técnicos que llegan desde BD', () => {
  beforeEach(() => {
    login()
    interceptQuery('groups', 'groups')
    cy.visit('/list-groups')
  })
  it('Comprobar que se listan todos los técnicos en la tabla', () => {
    cy.wait('@getgroups', { timeout: 3000 })
    cy.get('@groupsData').then((groups) => {
      cy.get('tbody > tr').should('have.length', groups.items.length)
      groups.items.forEach((group, index) => {
        cy.get(`tbody > tr:nth-child(${index + 1})`).within(() => {
          cy.get('td:nth-child(1)').should('contain.text', group.id)
          cy.get('td:nth-child(2)').should('contain.text', group.description)
        })
      })
    })
  })
  it('Hacer clic en el botón de editar técnico y validar la URL', () => {
    cy.wait('@getgroups', { timeout: 3000 })
    cy.get('@groupsData').then((groups) => {
      const firstGroupsId = groups.items[0].id
      const expectedUrl = `/edit-group/${firstGroupsId}`
      cy.get('tbody > tr:first-child')
        .find('td:nth-child(4) #editGroup')
        .click()
      cy.url().should('include', expectedUrl)
    })
  })
})
