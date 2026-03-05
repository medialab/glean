import type { LayoutServerLoad } from './$types';
import { FALLBACK_DEVICE_TYPE } from '$lib/device/defaults';

export const load: LayoutServerLoad = ({ locals }) => {
	const deviceTypeComputed = locals.deviceType || FALLBACK_DEVICE_TYPE;

	return {
		deviceType: deviceTypeComputed
	};
};
