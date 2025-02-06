/// <reference types="cypress" />
import { login, interceptQuery } from '../../support/utils'
describe('Listar todos los técnicos que llegan desde BD', () => {
  beforeEach(() => {
    login()
    interceptQuery('tasks', 'tasks')
    cy.visit('/list-tasks')
  })
  it('Comprobar que se listan todas las tareas en la tabla', () => {
    cy.wait('@gettasks', { timeout: 3000 })
    cy.get('@tasksData').then((tasks) => {
      cy.get('tbody > tr').should('have.length', tasks.items.length)
      tasks.items.forEach((task, index) => {
        cy.get(`tbody > tr:nth-child(${index + 1})`).within(() => {
          const price = task.prices[task.prices.length - 1]?.price ?? 0
          cy.get('td:nth-child(1)').should('contain.text', task.id)
          cy.get('td:nth-child(2)').should('contain.text', task.name)
          cy.get('td:nth-child(3)').should('contain.text', price)
        })
      })
    })
  })
  it('Hacer clic en el botón de editar tarea y validar la URL', () => {
    cy.wait('@gettasks', { timeout: 3000 })
    cy.get('@tasksData').then((tasks) => {
      const firstTaskId = tasks.items[0].id
      const expectedUrl = `/edit-task/${firstTaskId}`
      cy.get('tbody > tr:first-child')
        .find('td:nth-child(4) #editTask')
        .click()
      cy.url().should('include', expectedUrl)
    })
  })
})
