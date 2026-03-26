import type { CardTokenCreateClient } from './types';
import type { CardTokenResponse } from '../commonTypes';
export default function create({ body, config }: CardTokenCreateClient): Promise<CardTokenResponse>;
