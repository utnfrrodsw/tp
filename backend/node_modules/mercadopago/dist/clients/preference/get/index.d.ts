import type { PreferenceGetClient } from './types';
import type { PreferenceResponse } from '../../../clients/preference/commonTypes';
export default function get({ id, config }: PreferenceGetClient): Promise<PreferenceResponse>;
