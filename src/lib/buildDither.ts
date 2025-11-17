import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = 'src/lib/media/';
const outputDir = 'src/lib/ditheredMedia/';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.tif'];

async function ditherImage(inputPath: string, outputPath: string): Promise<void> {
	try {
		await sharp(inputPath)
			.greyscale()
			.resize(100, 100, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.modulate({ brightness: 2 })
			.png({
				compressionLevel: 9,
				quality: 1,
				adaptiveFiltering: true,
				palette: true,
				dither: 1,
				colors: 2,
				progressive: true
			})
			.toFile(outputPath);

		console.log(`✓ Dithered image saved to ${outputPath}`);
	} catch (error) {
		console.error(`✗ Failed to process ${inputPath}:`, error);
		throw error;
	}
}

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, { withFileTypes: true }, (err, folders) => {
	if (err) throw err;

	for (const folder of folders) {
		console.log(`Processing folder: ${folder.name}`);

		if (!folder.isDirectory()) {
			//we eliminate unique files
			continue;
		}

		fs.readdir(path.join(inputDir, folder.name), { withFileTypes: true }, (err, entries) => {
			if (err) {
				console.error(`Error reading ${folder.name}:`, err);
				return;
			}

			for (const entry of entries) {
				if (entry.isDirectory()) {
					console.log(`Processing directory: ${entry.name}`);
					const subfolderPath = path.join(inputDir, folder.name, entry.name);

					fs.readdir(subfolderPath, { withFileTypes: true }, (err, subentries) => {
						if (err) {
							console.error(`Error reading ${subfolderPath}:`, err);
							return;
						}
						for (const subentry of subentries) {
							processFolderFiles(path.join(folder.name, entry.name), subentry);
						}
					});
					continue;
				} else if (entry.isFile()) {
					console.log(`Processing file: ${entry.name}`);
					processFolderFiles(folder.name, entry);
				}
			}
		});
	}
});

function processFolderFiles(folderPath: string, entry: fs.Dirent) {
	const ext = path.extname(entry.name).toLowerCase();

	if (IMAGE_EXTENSIONS.includes(ext)) {
		const inputFilePath = path.join(inputDir, folderPath, entry.name);
		const outputFolderPath = path.join(outputDir, folderPath);
		const outputFilePath = path.join(outputFolderPath, entry.name.replace(/\.\w+$/, '.png'));

		if (!fs.existsSync(outputFolderPath)) {
			fs.mkdirSync(outputFolderPath, { recursive: true });
		}

		try {
			ditherImage(inputFilePath, outputFilePath);
		} catch (error) {
			console.error(`Error dithering ${inputFilePath}:`, error);
		}
	}
}
