import type { PaymentIntentResponse } from '../commonTypes';
import type { PointSearchPaymentIntentClient } from './types';
export default function searchPaymentIntent({ payment_intent_id, config }: PointSearchPaymentIntentClient): Promise<PaymentIntentResponse>;
