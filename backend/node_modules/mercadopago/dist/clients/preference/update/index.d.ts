import type { PreferenceUpdateClient } from './types';
import type { PreferenceResponse } from '../../../clients/preference/commonTypes';
export default function update({ id, updatePreferenceRequest, config }: PreferenceUpdateClient): Promise<PreferenceResponse>;
