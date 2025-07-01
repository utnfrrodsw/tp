import type { MerchantOrderResponse } from '../commonTypes';
import type { MerchantOrderGetClient } from './types';
export default function get({ merchantOrderId, config }: MerchantOrderGetClient): Promise<MerchantOrderResponse>;
