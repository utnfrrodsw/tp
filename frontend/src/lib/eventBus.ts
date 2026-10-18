type EventCallback = (payload?: unknown) => void;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // devuelve función de cleanup, ideal para useEffect
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, payload?: unknown): void {
    this.listeners.get(event)?.forEach(cb => cb(payload));
  }
}

export const eventBus = new EventBus();

// ─── Convención de nombres de eventos ────────────────────────────────────────
// Usá el patrón "entity:action" para mantener orden, ej:
//   "client:created", "client:updated", "client:deleted"
//   "failureType:created", "failureType:updated"

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

