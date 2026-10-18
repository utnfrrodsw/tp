//Creo este archivo para traer los eventos que se van a emitir desde el backend pero que se encuentran en el frontend, para evitar
// problemas de importacion.
export const EVENTS = {
  clientChanged: 'client:changed',
  clientDeleted: 'client:deleted',                    
  clientCategoryChanged: 'clientCategory:changed',
  clientCategoryDeleted: 'clientCategory:deleted',
  paymentTypeChanged: 'paymentType:changed',
  paymentTypeDeleted: 'paymentType:deleted',        
  failureTypeChanged: 'failureType:changed',
  failureTypeDeleted: 'failureType:deleted',
  failureChanged: 'failure:changed',
  failureDeleted: 'failure:deleted',
  userChanged: 'user:changed',
  statusChanged: 'status:changed',
  addedCostChanged: 'addedCost:changed',
  addedCostDeleted: 'addedCost:deleted',
  budgetChanged: 'budget:changed',
  budgetDeleted: 'budget:deleted',
} as const;