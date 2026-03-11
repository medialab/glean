// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { HomeCardDTO, ImageMetadata } from '$lib/types';

declare global {
	namespace App {
		interface PageData {
			cards?: HomeCardDTO[];
			deviceType?: DeviceType;
			projectMediaFiles?: Record<string, ImageMetadata | { default: string }>;
			subGalleryMediaFiles?: Record<string, ImageMetadata>;
			didascaliaByStem?: Record<string, string>;
			thumbnailSrc?: string | null;
			ditherThumbnailSrc?: string | null;
		}

		interface Platform {}

		interface PrivateEnv {}

		interface PublicEnv {}
	}
}

export {};
