import { OrderCancelClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function cancel({ id, config }: OrderCancelClient): Promise<OrderResponse>;
