import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve(process.cwd(), 'src/lib/media/');
const outputDir = path.resolve(process.cwd(), 'src/lib/ditheredMedia/');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.tif'];

async function ditherImage(inputPath: string, outputPath: string): Promise<void> {
	try {
		await sharp(inputPath)
			.greyscale()
			.resize(80, 80, {
				fit: 'inside',
				withoutEnlargement: false
			})
			.modulate({ brightness: 2 })
			.png({
				compressionLevel: 9,
				quality: 1,
				adaptiveFiltering: true,
				palette: true,
				dither: 1,
				colors: 16,
				progressive: true
			})
			.toFile(outputPath);

		console.log(`✓ Dithered image saved to ${outputPath}`);
	} catch (error) {
		console.error(`✗ Failed to process ${inputPath}:`, error);
		throw error;
	}
}

(async () => {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	try {
		const folders = await fs.promises.readdir(inputDir, { withFileTypes: true });

		for (const folder of folders) {
			console.log(`Processing folder: ${folder.name}`);

			if (!folder.isDirectory()) {
				continue;
			}

			try {
				const entries = await fs.promises.readdir(path.join(inputDir, folder.name), {
					withFileTypes: true
				});

				for (const entry of entries) {
					if (entry.isDirectory()) {
						console.log(`Processing directory: ${entry.name}`);
						const subfolderPath = path.join(inputDir, folder.name, entry.name);

						try {
							const subentries = await fs.promises.readdir(subfolderPath, {
								withFileTypes: true
							});
							for (const subentry of subentries) {
								await processFolderFiles(path.join(folder.name, entry.name), subentry);
							}
						} catch (err) {
							console.error(`Error reading ${subfolderPath}:`, err);
						}
						continue;
					} else if (entry.isFile()) {
						console.log(`Processing file: ${entry.name}`);
						await processFolderFiles(folder.name, entry);
					}
				}
			} catch (err) {
				console.error(`Error reading ${folder.name}:`, err);
			}
		}

		console.log('✓ All images processed');
	} catch (err) {
		console.error('Fatal error:', err);
		process.exit(1);
	}
})();

async function processFolderFiles(folderPath: string, entry: fs.Dirent) {
	const ext = path.extname(entry.name).toLowerCase();

	if (IMAGE_EXTENSIONS.includes(ext)) {
		const inputFilePath = path.join(inputDir, folderPath, entry.name);
		const outputFolderPath = path.join(outputDir, folderPath);
		const outputFilePath = path.join(outputFolderPath, entry.name.replace(/\.\w+$/, '.png'));

		if (!fs.existsSync(outputFolderPath)) {
			fs.mkdirSync(outputFolderPath, { recursive: true });
		}

		try {
			await ditherImage(inputFilePath, outputFilePath);
		} catch (error) {
			console.error(`Error dithering ${inputFilePath}:`, error);
		}
	}
}
