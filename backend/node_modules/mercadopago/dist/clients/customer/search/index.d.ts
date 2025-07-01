import type { CustomerSearchClient, CustomerSearchResultsPage } from './types';
export default function search({ options, config }: CustomerSearchClient): Promise<CustomerSearchResultsPage>;
