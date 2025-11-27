// Load image metadata (width, height, format, src) using vite-imagetools

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: string;
	default: string;
	// Optional additional metadata properties
	space?: string; // Color space
	channels?: number; // Number of color channels
	hasAlpha?: boolean; // Has transparency channel
	hasTransparency?: boolean; // Has transparency
	isOpaque?: boolean; // Is fully opaque
	orientation?: number; // EXIF orientation (1-8)
	density?: number; // DPI/PPI
	hasProfile?: boolean; // Has ICC color profile
	palette?: object; // Color palette for indexed images
	background?: string | { r: number; g: number; b: number; alpha?: number }; // Background color
};

export type OptimizedImage = {
	img: string;
	sources: {
		avif: string;
		webp: string;
	};
};

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

export const didascaliaModules: Record<string, any> = import.meta.glob(
	[
		'$lib/media/*/*.yml',
		'$lib/media/*/*/*.yml'
	],
	{
		eager: true,
		query: {
			raw: '',
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
