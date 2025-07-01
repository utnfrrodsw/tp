import type { CustomerCardResponse } from '../commonTypes';
import type { CustomerCardGetRemoveClient } from '../get/types';
export default function remove({ customerId, cardId, config }: CustomerCardGetRemoveClient): Promise<CustomerCardResponse>;
