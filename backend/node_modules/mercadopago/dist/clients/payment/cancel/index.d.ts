import type { PaymentResponse } from '../commonTypes';
import type { PaymentCancelClient } from './types';
export default function cancel({ id, config }: PaymentCancelClient): Promise<PaymentResponse>;
