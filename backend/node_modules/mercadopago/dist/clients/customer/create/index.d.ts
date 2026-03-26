import type { CustomerCreateClient } from './types';
import type { CustomerResponse } from '../commonTypes';
export default function create({ body, config }: CustomerCreateClient): Promise<CustomerResponse>;
