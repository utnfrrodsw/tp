/// <reference types="cypress" />
import { login, interceptQuery } from '../../support/utils'
describe('Listar todas las tareas que llegan desde BD', () => {
  beforeEach(() => {
    login()
    interceptQuery('task1', 'tasks/1')
    cy.visit('/edit-task/1')
  })
  it('Comprobar que se carguen los datos de la tarea en el formulario', () => {
    cy.wait('@gettasks/1', { timeout: 3000 })
    cy.get('@task1Data').then((task) => {
      cy.get('[data-cy="task-name"]').should('have.value', task.name)
      cy.get('[data-cy="task-price"]').should('have.value', task.prices[task.prices.length - 1].price)
      cy.get('tbody > tr').should('have.length', task.prices.length)
      task.prices.forEach((price, index) => {
        cy.get(`tbody > tr:nth-child(${index + 1})`).within(() => {
          const formattedDate = new Date(price.createdAt).toLocaleString()
          cy.get('td:nth-child(1)').should('contain.text', price.price)
          cy.get('td:nth-child(2)').should('contain.text', formattedDate)
        })
      })
    })
  })
  it('Comprobar modificación de datos', () => {
    cy.get('[data-cy="save-task"]').should('have.attr', 'disabled', 'disabled')
    cy.get('[data-cy="task-name"]').type('Task 23')
    cy.get('[data-cy="task-price"]').type('2')
    cy.get('[data-cy="save-task"]').should('not.have.attr', 'disabled')
    cy.intercept('PUT', '**/tasks/1').as('saveTask')
    cy.get('[data-cy="save-task"]').click()
    cy.wait('@saveTask').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })
  })
})
