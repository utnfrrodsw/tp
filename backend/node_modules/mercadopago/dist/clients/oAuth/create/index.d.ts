import type { OAuthCreateClient } from './types';
import type { OAuthResponse } from '../commonTypes';
export default function create({ body, config }: OAuthCreateClient): Promise<OAuthResponse>;
