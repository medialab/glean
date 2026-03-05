import fs from 'fs/promises';
import path from 'path';

const mediaFolderPath = path.resolve(process.cwd(), 'src/lib/media');

const collectMediaFiles = async (rootDir: string): Promise<string[]> => {
	const entries = await fs.readdir(rootDir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.name.startsWith('.')) continue;

		const fullPath = path.join(rootDir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectMediaFiles(fullPath)));
			continue;
		}

		if (entry.isFile() && !entry.name.toLowerCase().endsWith('.yml')) {
			files.push(fullPath);
		}
	}

	return files.sort((a, b) => a.localeCompare(b, 'en'));
};

const ensureDidascaliaFile = async (sourceFilePath: string): Promise<void> => {
	const ymlPath = sourceFilePath.replace(/\.[^.]+$/, '.yml');

	try {
		await fs.access(ymlPath);
		console.log(`File ${path.basename(ymlPath)} already exists, skipping`);
		return;
	} catch {
		// Expected when file doesn't exist.
	}

	await fs.writeFile(ymlPath, 'imgDescription: ""', 'utf8');
	console.log(`Writing file: ${ymlPath}`);
};

const run = async (): Promise<void> => {
	const mediaFiles = await collectMediaFiles(mediaFolderPath);
	for (const mediaFile of mediaFiles) {
		await ensureDidascaliaFile(mediaFile);
	}
};

void run().catch((error) => {
	console.error('imgYmlCreator failed:', error);
	process.exit(1);
});
