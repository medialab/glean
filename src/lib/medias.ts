// Load image metadata (width, height, format, src) using vite-imagetools

import type { ImageMetadata, YamlTextModule } from './types';

export const mediaFilesModules: Record<string, ImageMetadata> = import.meta.glob(
	[
		'$lib/media/*/*.png',
		'$lib/media/*/*.jpg',
		'$lib/media/*/*.jpeg',
		'$lib/media/*/*.webp',
		'$lib/media/*/*.gif',
		'$lib/media/*/*.pdf',
		'$lib/media/*/*.mp4',
		'$lib/media/*/*.mov',
		'$lib/media/*/*.MOV'
	],
	{
		eager: true,
		query: {
			metadata: '',
			w: '1200',
			as: 'metadata',
			enhanced: true,
			quality: 80,
			//format: 'webp',
			allowUpscale: true,
			allowDownscale: true,
			removeMetadata: false
		}
	}
);

export const didascaliaModules: Record<string, YamlTextModule> = import.meta.glob(
	['$lib/media/*/*.yml', '$lib/media/*/*/*.yml'],
	{
		eager: true,
		query: {
			raw: ''
		}
	}
);

export const subGalleryModules: Record<string, ImageMetadata> = import.meta.glob(
	[
		'$lib/media/*/*/*.png',
		'$lib/media/*/*/*.jpg',
		'$lib/media/*/*/*.jpeg',
		'$lib/media/*/*/*.webp',
		'$lib/media/*/*/*.gif'
	],
	{
		eager: true,
		query: {
			metadata: '',
			w: '1200',
			as: 'metadata',
			enhanced: true,
			quality: 80,
			format: 'webp',
			allowUpscale: 'true',
			allowDownscale: 'true',
			removeMetadata: 'false'
		}
	}
);

export const ditheredMediaFilesModules: Record<string, ImageMetadata> = import.meta.glob(
	[
		'$lib/ditheredMedia/**/*.png',
		'$lib/ditheredMedia/**/*.jpg',
		'$lib/ditheredMedia/**/*.jpeg',
		'$lib/ditheredMedia/**/*.webp',
		'$lib/ditheredMedia/**/*.gif'
	],
	{
		eager: true,
		query: {
			metadata: '',
			as: 'metadata',
			removeMetadata: 'false'
		}
	}
);
