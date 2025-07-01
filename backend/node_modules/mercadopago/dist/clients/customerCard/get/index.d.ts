import type { CustomerCardGetRemoveClient } from './types';
import type { CustomerCardResponse } from '../commonTypes';
export default function get({ customerId, cardId, config }: CustomerCardGetRemoveClient): Promise<CustomerCardResponse>;
