import type { QueryKey } from '@tanstack/react-query';
import { EVENTS } from './eventBus';

export const QUERY_KEYS = {
  clients: ['clients'] as const,
  clientTypes: ['clientTypes'] as const,

  paymentTypes: ['paymentTypes'] as const,

  failureTypes: ['failureTypes'] as const,
  failures: ['failures'] as const,

  users: ['users'] as const,
  statuses: ['statuses'] as const,

  addedCosts: ['addedCosts'] as const,
  budgets: ['budgets'] as const,
} satisfies Record<string, QueryKey>;

export const EVENT_QUERY_MAP = {
  [EVENTS.clientChanged]: QUERY_KEYS.clients,
  [EVENTS.clientDeleted]: QUERY_KEYS.clients,

  [EVENTS.clientCategoryChanged]: QUERY_KEYS.clientTypes,
  [EVENTS.clientCategoryDeleted]: QUERY_KEYS.clientTypes,

  [EVENTS.paymentTypeChanged]: QUERY_KEYS.paymentTypes,
  [EVENTS.paymentTypeDeleted]: QUERY_KEYS.paymentTypes,

  [EVENTS.failureTypeChanged]: QUERY_KEYS.failureTypes,
  [EVENTS.failureTypeDeleted]: QUERY_KEYS.failureTypes,

  [EVENTS.failureChanged]: QUERY_KEYS.failures,
  [EVENTS.failureDeleted]: QUERY_KEYS.failures,

  [EVENTS.userChanged]: QUERY_KEYS.users,

  [EVENTS.statusChanged]: QUERY_KEYS.statuses,

  [EVENTS.addedCostChanged]: QUERY_KEYS.addedCosts,
  [EVENTS.addedCostDeleted]: QUERY_KEYS.addedCosts,

  [EVENTS.budgetChanged]: QUERY_KEYS.budgets,
  [EVENTS.budgetDeleted]: QUERY_KEYS.budgets,
} as const;