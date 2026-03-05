// Load image metadata (width, height, format, src) using vite-imagetools

import type { ImageMetadata } from './types';

type MediaFileModule = ImageMetadata | string;
type MediaFileLoader = () => Promise<MediaFileModule>;
type ImageMetadataLoader = () => Promise<ImageMetadata>;
type YamlTextLoader = () => Promise<string>;

export const mediaFilesModules = import.meta.glob(
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
		eager: false,
		import: 'default',
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
) as Record<string, MediaFileLoader>;

export const didascaliaModules = import.meta.glob(['$lib/media/*/*.yml', '$lib/media/*/*/*.yml'], {
	eager: false,
	import: 'default',
	query: {
		raw: ''
	}
}) as Record<string, YamlTextLoader>;

export const subGalleryModules = import.meta.glob(
	[
		'$lib/media/*/*/*.png',
		'$lib/media/*/*/*.jpg',
		'$lib/media/*/*/*.jpeg',
		'$lib/media/*/*/*.webp',
		'$lib/media/*/*/*.gif'
	],
	{
		eager: false,
		import: 'default',
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
) as Record<string, ImageMetadataLoader>;

export const ditheredMediaFilesModules = import.meta.glob(['$lib/ditheredMedia/**/*.png'], {
	eager: false,
	import: 'default',
	query: {
		metadata: '',
		as: 'metadata',
		removeMetadata: 'false'
	}
}) as Record<string, ImageMetadataLoader>;

export const homeMediaMetadataLoaders = import.meta.glob(
	[
		'$lib/media/*/*.png',
		'$lib/media/*/*.jpg',
		'$lib/media/*/*.jpeg',
		'$lib/media/*/*.webp',
		'$lib/media/*/*.gif'
	],
	{
		eager: false,
		import: 'default',
		query: {
			metadata: '',
			w: '400',
			as: 'metadata',
			enhanced: true,
			quality: 70,
			//format: 'webp',
			allowUpscale: true,
			allowDownscale: true,
			removeMetadata: false
		}
	}
) as Record<string, ImageMetadataLoader>;

export const homeDitheredMediaMetadataLoaders = import.meta.glob(['$lib/ditheredMedia/**/*.png'], {
	eager: false,
	import: 'default',
	query: {
		metadata: '',
		as: 'metadata',
		removeMetadata: 'false'
	}
}) as Record<string, ImageMetadataLoader>;
