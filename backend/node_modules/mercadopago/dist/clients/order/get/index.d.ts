import { OrderGetClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function get({ id, config }: OrderGetClient): Promise<OrderResponse>;
