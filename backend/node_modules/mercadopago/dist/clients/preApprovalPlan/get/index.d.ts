import type { PreApprovalPlanGetClient } from './types';
import type { PreApprovalPlanResponse } from '../../../clients/preApprovalPlan/commonTypes';
export default function get({ id, config }: PreApprovalPlanGetClient): Promise<PreApprovalPlanResponse>;
