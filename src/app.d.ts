// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DevicePayload } from 'sveltekit-device-detector/dist/types';
import type { ImageMetadata } from '$lib/medias';

type Project = {
	tag: string;
	[key: string]: any;
};

declare global {
	namespace App {
		interface Locals {
			deviceType: DevicePayload;
		}

		interface PageData {
			projects?: Project[];
			mediaFilesModules?: Record<string, ImageMetadata>;
			ditheredMediaFilesModules?: Record<string, ImageMetadata>;
			deviceType: DevicePayload;
		}

		interface Platform {}

		interface PrivateEnv {}

		interface PublicEnv {}
	}
}

export {};
