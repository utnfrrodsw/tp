import type { PaymentResponse } from '../commonTypes';
import type { PaymentGetClient } from './types';
export default function get({ id, config }: PaymentGetClient): Promise<PaymentResponse>;
