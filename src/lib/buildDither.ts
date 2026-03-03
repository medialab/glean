import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import {
	DITHER_INPUT_EXTENSIONS,
	DEFAULT_DITHER_PROFILE,
	type DitherProfile
} from './dither.config';

const inputDir = path.resolve(process.cwd(), 'src/lib/media');
const outputDir = path.resolve(process.cwd(), 'src/lib/ditheredMedia');

const isSupportedSourceImage = (filePath: string): boolean => {
	return DITHER_INPUT_EXTENSIONS.includes(
		path.extname(filePath).toLowerCase() as (typeof DITHER_INPUT_EXTENSIONS)[number]
	);
};

const collectSourceImages = async (rootDir: string): Promise<string[]> => {
	const entries = await fs.readdir(rootDir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.name.startsWith('.')) {
			continue;
		}

		const fullPath = path.join(rootDir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectSourceImages(fullPath)));
			continue;
		}

		if (entry.isFile() && isSupportedSourceImage(fullPath)) {
			files.push(fullPath);
		}
	}

	return files.sort((a, b) => a.localeCompare(b, 'en'));
};

const sourceToOutputPath = (sourcePath: string): string => {
	const relativePath = path.relative(inputDir, sourcePath);
	return path.join(outputDir, relativePath.replace(/\.[^.]+$/, '.png'));
};

const ditherOne = async (
	sourcePath: string,
	outputPath: string,
	profile: DitherProfile
): Promise<void> => {
	await fs.mkdir(path.dirname(outputPath), { recursive: true });

	let pipeline = sharp(sourcePath).resize(profile.resize.width, profile.resize.height, {
		fit: profile.resize.fit,
		withoutEnlargement: profile.resize.withoutEnlargement
	});

	if (profile.grayscale) {
		pipeline = pipeline.greyscale();
	}

	pipeline = pipeline.modulate(profile.modulate);

	await pipeline.png(profile.png).toFile(outputPath);
};

const runDither = async (): Promise<void> => {
	await fs.rm(outputDir, { recursive: true, force: true });
	await fs.mkdir(outputDir, { recursive: true });

	const sourceImages = await collectSourceImages(inputDir);

	if (sourceImages.length === 0) {
		console.warn('No source images found for dithering.');
		return;
	}

	console.log(`Dithering ${sourceImages.length} image(s)...`);

	for (const sourceImage of sourceImages) {
		const outputPath = sourceToOutputPath(sourceImage);
		await ditherOne(sourceImage, outputPath, DEFAULT_DITHER_PROFILE);
		console.log(`✓ ${path.relative(process.cwd(), outputPath)}`);
	}

	console.log('✓ Dither generation completed');
};

void runDither().catch((error) => {
	console.error('Dither generation failed:', error);
	process.exit(1);
});
