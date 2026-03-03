import fs from 'fs/promises';
import path from 'path';
import { DITHER_INPUT_EXTENSIONS } from './dither.config';

const inputDir = path.resolve(process.cwd(), 'src/lib/media');
const outputDir = path.resolve(process.cwd(), 'src/lib/ditheredMedia');

const OUTPUT_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'] as const;

const isSourceImage = (filePath: string): boolean => {
	return DITHER_INPUT_EXTENSIONS.includes(
		path.extname(filePath).toLowerCase() as (typeof DITHER_INPUT_EXTENSIONS)[number]
	);
};

const isDitherOutputImage = (filePath: string): boolean => {
	return OUTPUT_IMAGE_EXTENSIONS.includes(
		path.extname(filePath).toLowerCase() as (typeof OUTPUT_IMAGE_EXTENSIONS)[number]
	);
};

const walkFiles = async (rootDir: string): Promise<string[]> => {
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

const toExpectedRelativeOutputPath = (sourcePath: string): string => {
	return path
		.relative(inputDir, sourcePath)
		.replace(/\.[^.]+$/, '.png')
		.replaceAll('\\', '/');
};

const toActualRelativeOutputPath = (outputPath: string): string => {
	return path.relative(outputDir, outputPath).replaceAll('\\', '/');
};

const printPreview = (label: string, values: string[]): void => {
	if (values.length === 0) {
		return;
	}

	console.error(`\n${label} (${values.length}):`);
	for (const value of values.slice(0, 25)) {
		console.error(`- ${value}`);
	}
	if (values.length > 25) {
		console.error(`...and ${values.length - 25} more`);
	}
};

const runValidation = async (): Promise<void> => {
	const sourceFiles = (await walkFiles(inputDir)).filter(isSourceImage);
	const outputFiles = (await walkFiles(outputDir)).filter(isDitherOutputImage);

	const expectedOutputs = sourceFiles.map(toExpectedRelativeOutputPath);
	const actualOutputs = outputFiles.map(toActualRelativeOutputPath);

	const expectedSet = new Set(expectedOutputs);
	const actualSet = new Set(actualOutputs);

	const missing = expectedOutputs.filter((item) => !actualSet.has(item));
	const stale = actualOutputs.filter((item) => !expectedSet.has(item));

	printPreview('Missing dither outputs', missing);
	printPreview('Stale dither outputs', stale);

	if (missing.length > 0 || stale.length > 0) {
		throw new Error(
			`Dither validation failed. missing=${missing.length}, stale=${stale.length}, expected=${expectedOutputs.length}, actual=${actualOutputs.length}`
		);
	}

	console.log(
		`✓ Dither parity check passed (${expectedOutputs.length} expected / ${actualOutputs.length} actual)`
	);
};

void runValidation().catch((error) => {
	console.error('Dither validation failed:', error);
	process.exit(1);
});
