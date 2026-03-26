import type { CustomerResponse } from '../commonTypes';
import type { CustomerUpdateClient } from './types';
export default function update({ customerId, body, config }: CustomerUpdateClient): Promise<CustomerResponse>;
