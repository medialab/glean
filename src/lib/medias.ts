// Load image metadata (width, height, format, src) using vite-imagetools

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: string;
	default: string;
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
		'$lib/media/**/*.png',
		'$lib/media/**/*.jpg',
		'$lib/media/**/*.jpeg',
		'$lib/media/**/*.webp',
		'$lib/media/**/*.gif',
		'$lib/media/**/*.pdf',
		'$lib/media/**/THUMB/*',
		'$lib/media/**/*.mp4',
		'$lib/media/**/*.mov',
		'$lib/media/**/*.MOV'
	],
	{
		eager: true,
		query: {
			w: '1200',
			format: 'webp',
			quality: '90',
			metadata: '',
			as: 'metadata'
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
			w: '1200',
			format: 'webp',
			quality: '100',
			metadata: '',
			as: 'metadata'
		}
	}
);
