import type { CustomerResponse } from '../commonTypes';
import type { CustomerRemoveClient } from './types';
export default function remove({ customerId, config }: CustomerRemoveClient): Promise<CustomerResponse>;
