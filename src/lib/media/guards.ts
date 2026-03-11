import type { ImageMetadata } from '$lib/utils/types';

export const isImageMetadata = (value: unknown): value is ImageMetadata => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'src' in value &&
		'width' in value &&
		'height' in value
	);
};

export const normalizeImageMetadata = (value: unknown): ImageMetadata | null => {
	if (isImageMetadata(value)) return value;
	if (typeof value === 'object' && value !== null && 'default' in value) {
		const defaultValue = (value as { default?: unknown }).default;
		if (isImageMetadata(defaultValue)) return defaultValue;
	}
	return null;
};
