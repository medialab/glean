// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DeviceType, ImageMetadata, Project } from '$lib/types';

declare global {
		namespace App {
			interface Locals {
				deviceType: DeviceType;
			}

			interface PageData {
				projects?: Project[];
				mediaFilesModules?: Record<string, ImageMetadata>;
				ditheredMediaFilesModules?: Record<string, ImageMetadata>;
				deviceType: DeviceType;
			}

		interface Platform {}

		interface PrivateEnv {}

		interface PublicEnv {}
	}
}

export {};
