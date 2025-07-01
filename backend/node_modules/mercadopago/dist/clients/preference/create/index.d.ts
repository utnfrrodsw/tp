import type { PreferenceCreateClient } from './types';
import type { PreferenceResponse } from '../../../clients/preference/commonTypes';
export default function create({ body, config }: PreferenceCreateClient): Promise<PreferenceResponse>;
