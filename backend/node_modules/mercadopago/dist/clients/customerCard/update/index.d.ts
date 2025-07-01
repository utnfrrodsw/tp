import type { CustomerCardResponse } from '../commonTypes';
import type { CustomerCardUpdateClient } from './types';
export default function update({ customerId, cardId, body, config }: CustomerCardUpdateClient): Promise<CustomerCardResponse>;
