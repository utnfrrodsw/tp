import type { PaymentMethodGetClient, PaymentMethodResponse } from './types';
export default function get({ config }: PaymentMethodGetClient): Promise<PaymentMethodResponse[]>;
