import type { PaymentRefundGetClient } from './types';
import type { RefundResponse } from '../commonTypes';
export default function get({ payment_id, refund_id, config }: PaymentRefundGetClient): Promise<RefundResponse>;
