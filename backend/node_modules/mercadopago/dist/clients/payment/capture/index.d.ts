import type { PaymentResponse } from '../commonTypes';
import type { PaymentCaptureClient } from './types';
export default function capture({ id, transaction_amount, config }: PaymentCaptureClient): Promise<PaymentResponse>;
