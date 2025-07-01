import type { PaymentRefundListClient } from './types';
import type { RefundResponse } from '../commonTypes';
export default function list({ payment_id, config }: PaymentRefundListClient): Promise<Array<RefundResponse>>;
