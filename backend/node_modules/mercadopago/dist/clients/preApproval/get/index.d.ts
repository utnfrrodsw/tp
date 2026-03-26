import type { PreApprovalGetClient } from './types';
import type { PreApprovalResponse } from '../../../clients/preApproval/commonTypes';
export default function get({ id, config }: PreApprovalGetClient): Promise<PreApprovalResponse>;
