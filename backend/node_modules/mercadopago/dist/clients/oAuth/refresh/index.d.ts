import type { OAuthRefreshClient } from './types';
import type { OAuthResponse } from '../commonTypes';
export default function refresh({ body, config }: OAuthRefreshClient): Promise<OAuthResponse>;
