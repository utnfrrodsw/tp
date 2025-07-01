import { OrderRefundClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function refund({ id, body, config }: OrderRefundClient): Promise<OrderResponse>;
