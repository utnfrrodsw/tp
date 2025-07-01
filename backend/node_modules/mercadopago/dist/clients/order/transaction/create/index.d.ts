import { TransactionsApiResponse } from '../../commonTypes';
import { OrderCreateTransactionClient } from './types';
export default function createTransaction({ id, body, config }: OrderCreateTransactionClient): Promise<TransactionsApiResponse>;
