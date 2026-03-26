import type { MerchantOrderCreateClient } from './types';
import type { MerchantOrderResponse } from '../commonTypes';
export default function create({ body, config }: MerchantOrderCreateClient): Promise<MerchantOrderResponse>;
