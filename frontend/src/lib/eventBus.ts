// ─── eventBus.ts ─────────────────────────────────────────────────────────────
// Bus de eventos minimalista para comunicar componentes desacoplados
// (ej: un Alta dispara, una DataTable escucha y refresca).
//
// No usa WebSocket porque el cambio y la actualización ocurren
// en la misma sesión/pestaña del mismo usuario.

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
  clientCategoryChanged: 'clientCategory:changed',
  paymentTypeChanged: 'paymentType:changed',
  failureTypeChanged: 'failureType:changed',
  failureTypeDeleted: 'failureType:deleted',
  // agregá acá nuevas entidades a medida que las necesites
} as const;