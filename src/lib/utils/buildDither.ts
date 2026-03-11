import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { intBuffer, GRAY8 } from '@thi.ng/pixel';
import { orderedDither, type BayerSize } from '@thi.ng/pixel-dither';
import { isHomeCardSourceImage, walkFiles } from '$lib/scripts/media-walk';

type DitherProfile = {
	resize: {
		width: number;
		height: number;
		fit: 'inside' | 'cover' | 'contain' | 'fill' | 'outside';
		withoutEnlargement: boolean;
	};
	bayer: {
		size: BayerSize;
		numColors: number;
	};
	png: {
		compressionLevel: number;
		adaptiveFiltering: boolean;
		palette: boolean;
		colors: number;
		progressive: boolean;
	};
};

const DEFAULT_DITHER_PROFILE: DitherProfile = {
	resize: {
		width: 1024,
		height: 1024,
		fit: 'inside',
		withoutEnlargement: false
	},
	bayer: {
		size: 8,
		numColors: 3
	},
	png: {
		compressionLevel: 9,
		adaptiveFiltering: true,
		palette: true,
		colors: 3,
		progressive: false
	}
};

const inputDir = path.resolve(process.cwd(), 'src/lib/media');
const outputDir = path.resolve(process.cwd(), 'src/lib/ditheredMedia');

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

	const sourcePipeline = sharp(sourcePath).resize(profile.resize.width, profile.resize.height, {
		fit: profile.resize.fit,
		withoutEnlargement: profile.resize.withoutEnlargement
	});

	const { data, info } = await sourcePipeline
		.rotate()
		.flatten({ background: '#ffffff' })
		.greyscale()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const grayscalePixels = Uint8Array.from(data);
	const image = intBuffer(info.width, info.height, GRAY8, grayscalePixels);

	orderedDither(image, profile.bayer.size, profile.bayer.numColors);

	await sharp(Buffer.from(image.data as Uint8Array), {
		raw: {
			width: info.width,
			height: info.height,
			channels: 1
		}
	})
		.png(profile.png)
		.toFile(outputPath);
};

const runDither = async (): Promise<void> => {
	await fs.rm(outputDir, { recursive: true, force: true });
	await fs.mkdir(outputDir, { recursive: true });

	const sourceImages = (await walkFiles(inputDir)).filter((filePath) =>
		isHomeCardSourceImage(filePath, inputDir)
	);

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
