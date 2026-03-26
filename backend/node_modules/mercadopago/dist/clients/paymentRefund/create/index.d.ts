import type { PaymentRefundCreateClient } from './types';
import type { RefundResponse } from '../commonTypes';
export default function create({ payment_id, body, config }: PaymentRefundCreateClient): Promise<RefundResponse>;
