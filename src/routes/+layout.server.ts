import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const deviceTypeComputed = locals.deviceType || {
		isMobile: false,
		isTablet: false,
		isDesktop: true
	};

	return {
		deviceType: deviceTypeComputed
	};
};
