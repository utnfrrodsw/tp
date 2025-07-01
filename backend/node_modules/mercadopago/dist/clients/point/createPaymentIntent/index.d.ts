import type { PointCreatePaymentIntentClient } from './types';
import type { PaymentIntentResponse } from '../commonTypes';
export default function createPaymentIntent({ device_id, request, config }: PointCreatePaymentIntentClient): Promise<PaymentIntentResponse>;
