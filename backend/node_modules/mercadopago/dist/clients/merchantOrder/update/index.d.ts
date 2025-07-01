import type { MerchantOrderResponse } from '../commonTypes';
import type { MerchantOrderUpdateClient } from './types';
export default function update({ merchantOrderId, body, config }: MerchantOrderUpdateClient): Promise<MerchantOrderResponse>;
