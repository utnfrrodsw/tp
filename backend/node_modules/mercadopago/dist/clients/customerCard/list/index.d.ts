import type { CustomerCardListClient } from './types';
import type { CustomerCardResponse } from '../commonTypes';
export default function list({ customerId, config }: CustomerCardListClient): Promise<CustomerCardResponse[]>;
