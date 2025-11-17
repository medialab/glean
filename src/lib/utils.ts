// Client-side utility functions
import type { ImageMetadata } from '$lib/medias';
import { writable } from 'svelte/store';

export type ImageShape = 'Horizontal' | 'Vertical' | 'Square';

export let colorMode = writable<'light' | 'dark'>('light');

export const findThumbnailImage = (
	mediaFilesModules: Record<string, ImageMetadata>,
	projectTag: string
): { src: string; shape: ImageShape } | null => {
	const thumbnailKey = Object.keys(mediaFilesModules).find(
		(key) => key.includes(`/${projectTag}/`) && key.toLowerCase().includes('thumb')
	);

	if (!thumbnailKey) return null;

	const meta = mediaFilesModules[thumbnailKey];
	const shape: ImageShape =
		meta.width === meta.height ? 'Square' : meta.width > meta.height ? 'Horizontal' : 'Vertical';

	return { src: meta.src, shape };
};

export const stackObtainer = (
	mediaFilesModules: Record<string, ImageMetadata>,
	projectTag: string
): Record<string, ImageMetadata> => {
	return Object.keys(mediaFilesModules)
		.filter(
			(key) =>
				key.includes(`.jpeg`) ||
				key.includes(`.jpg`) ||
				key.includes(`.png`) ||
				key.includes(`.webp`)
		)
		.filter((key) => key.includes(`/${projectTag}/`))
		.filter((key) => !key.toLowerCase().includes('thumb'))
		.slice(0, 5)
		.reduce((obj: Record<string, ImageMetadata>, key) => {
			obj[key] = mediaFilesModules[key];
			return obj;
		}, {});
};
