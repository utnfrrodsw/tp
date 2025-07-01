import type { PaymentCreateClient } from './types';
import type { PaymentResponse } from '../commonTypes';
export default function create({ body, config }: PaymentCreateClient): Promise<PaymentResponse>;
