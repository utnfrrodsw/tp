import type { UserGetClient, UserResponse } from './types';
export default function get({ config }: UserGetClient): Promise<UserResponse>;
