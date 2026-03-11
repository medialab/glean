import { writable } from 'svelte/store';
import type { DeviceType } from '$lib/types';

const defaultDeviceType: DeviceType = {
	isMobile: false,
	isTablet: false,
	isDesktop: true
};

export const deviceType = writable<DeviceType>(defaultDeviceType);
