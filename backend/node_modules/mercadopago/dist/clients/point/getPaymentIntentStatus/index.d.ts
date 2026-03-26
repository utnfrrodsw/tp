import type { PaymentIntentStatusResponse } from '../commonTypes';
import type { PointGetPaymentIntentStatusClient } from './types';
export default function getPaymentIntentStatus({ payment_intent_id, config }: PointGetPaymentIntentStatusClient): Promise<PaymentIntentStatusResponse>;
