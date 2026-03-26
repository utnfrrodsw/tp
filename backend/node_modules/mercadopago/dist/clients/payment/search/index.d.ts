import type { PaymentSearch, PaymentSearchClient } from './types';
export default function search({ options, config }: PaymentSearchClient): Promise<PaymentSearch>;
