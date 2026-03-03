import { handleDeviceDetector } from 'sveltekit-device-detector';
import type { Handle } from '@sveltejs/kit';
import type { DeviceType } from '$lib/types';

const fallbackDeviceType: DeviceType = {
	isMobile: false,
	isTablet: false,
	isDesktop: true
};

const deviceDetectorHandle = handleDeviceDetector({
	fallbackUserAgent:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
});

export const handle: Handle = async ({ event, resolve }) => {
	// During prerender there is no real User-Agent. Skip detector to avoid repeated warnings.
	if (!event.request.headers.get('user-agent')) {
		event.locals.deviceType = fallbackDeviceType;
		return resolve(event);
	}

	return deviceDetectorHandle({ event, resolve });
};
