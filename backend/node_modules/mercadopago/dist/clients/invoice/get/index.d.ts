import type { InvoiceGetClient } from './types';
import type { InvoiceResponse } from '../../../clients/invoice/commonTypes';
export default function get({ id, config }: InvoiceGetClient): Promise<InvoiceResponse>;
