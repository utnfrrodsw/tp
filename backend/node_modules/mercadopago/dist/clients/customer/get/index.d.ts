import type { CustomerGetClient } from './types';
import type { CustomerResponse } from '../commonTypes';
export default function get({ customerId, config }: CustomerGetClient): Promise<CustomerResponse>;
