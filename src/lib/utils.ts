// Client-side utility functions
import type { ImageMetadata } from '$lib/medias';
import { writable } from 'svelte/store';

type ImageShape = 'Horizontal' | 'Vertical' | 'Square';

export let colorMode = writable<'light' | 'dark'>('light');

export const extractThumbnailImage = (
	mediaFilesModules: Record<string, ImageMetadata>,
	projectTag: string
): { src: string; shape: ImageShape } | null => {
	const thumbnailKey = Object.keys(mediaFilesModules).find(
		(key) => key.includes(`/${projectTag}/THUMB/`) && key.toLowerCase().includes('thumb')
	);

	if (!thumbnailKey) return null;

	const meta = mediaFilesModules[thumbnailKey];
	const shape: ImageShape =
		meta.width === meta.height ? 'Square' : meta.width > meta.height ? 'Horizontal' : 'Vertical';

	return { src: meta.src, shape };
};
