import { OrderProcessClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function process({ id, config }: OrderProcessClient): Promise<OrderResponse>;
