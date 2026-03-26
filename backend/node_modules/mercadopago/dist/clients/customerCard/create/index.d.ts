import type { CustomerCardResponse } from '../commonTypes';
import type { CustomerCardCreateClient } from './types';
export default function create({ customerId, body, config }: CustomerCardCreateClient): Promise<CustomerCardResponse>;
