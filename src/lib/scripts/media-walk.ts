import fs from 'fs/promises';
import path from 'path';

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

export const OUTPUT_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'] as const;

export const isSourceImage = (filePath: string): boolean => {
	return DITHER_INPUT_EXTENSIONS.includes(
		path.extname(filePath).toLowerCase() as (typeof DITHER_INPUT_EXTENSIONS)[number]
	);
};

export const isHomeCardSourceImage = (filePath: string, inputDir: string): boolean => {
	if (!isSourceImage(filePath)) return false;
	const relativePath = path.relative(inputDir, filePath).replaceAll('\\', '/');
	const depth = relativePath.split('/').length;
	return depth === 2;
};

export const isOutputImage = (filePath: string): boolean => {
	return OUTPUT_IMAGE_EXTENSIONS.includes(
		path.extname(filePath).toLowerCase() as (typeof OUTPUT_IMAGE_EXTENSIONS)[number]
	);
};

export const walkFiles = async (rootDir: string): Promise<string[]> => {
	const entries = await fs.readdir(rootDir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.name.startsWith('.')) {
			continue;
		}

		const fullPath = path.join(rootDir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await walkFiles(fullPath)));
			continue;
		}

		if (entry.isFile()) {
			files.push(fullPath);
		}
	}

	return files.sort((a, b) => a.localeCompare(b, 'en'));
};
