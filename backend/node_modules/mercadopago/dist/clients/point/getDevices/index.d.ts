import type { GetDevicesResponse } from '../commonTypes';
import type { PointGetDevicesClient } from './types';
export default function getDevices({ options, config }: PointGetDevicesClient): Promise<GetDevicesResponse>;
