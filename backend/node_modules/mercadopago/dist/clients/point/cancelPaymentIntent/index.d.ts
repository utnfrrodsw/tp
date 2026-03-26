import type { CancelPaymentIntentResponse } from '../commonTypes';
import type { PointCancelPaymentIntentClient } from './types';
export default function cancelPaymentIntent({ device_id, payment_intent_id, config }: PointCancelPaymentIntentClient): Promise<CancelPaymentIntentResponse>;
