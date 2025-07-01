import type { RefundResponse } from '../commonTypes';
import type { PaymentRefundTotalClient } from './types';
export default function total({ payment_id, config }: PaymentRefundTotalClient): Promise<RefundResponse>;
