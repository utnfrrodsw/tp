import { OrderCreateClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function create({ body, config }: OrderCreateClient): Promise<OrderResponse>;
