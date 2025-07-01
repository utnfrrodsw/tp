import type { PreApprovalCreateClient } from './types';
import type { PreApprovalResponse } from '../../../clients/preApproval/commonTypes';
export default function create({ body, config }: PreApprovalCreateClient): Promise<PreApprovalResponse>;
