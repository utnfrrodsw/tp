import { OrderCaptureClient } from './types';
import { OrderResponse } from '../commonTypes';
export default function capture({ id, config }: OrderCaptureClient): Promise<OrderResponse>;
