export type DitherProfile = {
	grayscale: boolean;
	resize: {
		width: number;
		height: number;
		fit: 'inside' | 'cover' | 'contain' | 'fill' | 'outside';
		withoutEnlargement: boolean;
	};
	modulate: {
		brightness: number;
	};
	png: {
		compressionLevel: number;
		quality: number;
		adaptiveFiltering: boolean;
		palette: boolean;
		dither: number;
		colors: number;
		progressive: boolean;
	};
};

export const DITHER_INPUT_EXTENSIONS = [
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.bmp',
	'.tiff',
	'.tif'
] as const;

export const DEFAULT_DITHER_PROFILE: DitherProfile = {
	grayscale: true,
	resize: {
		width: 80,
		height: 80,
		fit: 'inside',
		withoutEnlargement: false
	},
	modulate: {
		brightness: 2
	},
	png: {
		compressionLevel: 9,
		quality: 1,
		adaptiveFiltering: true,
		palette: true,
		dither: 1,
		colors: 16,
		progressive: true
	}
};
