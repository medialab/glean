import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const yamlPath = path.join(rootDir, 'src/lib/dataset/main.yaml');
const mediaDir = path.join(rootDir, 'src/lib/media');

const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const data = yaml.load(yamlContent);

if (!data || !data.projects) {
	console.log('No projects found in YAML');
	process.exit(0);
}

const tags = data.projects.map((p) => p.tag).filter(Boolean);

if (tags.length === 0) {
	console.log('No tags found in projects');
	process.exit(0);
}

const existingFolders = fs.readdirSync(mediaDir).filter((f) => {
	return fs.statSync(path.join(mediaDir, f)).isDirectory();
});

let createdCount = 0;

tags.forEach((tag) => {
	if (!existingFolders.includes(tag)) {
		const newDir = path.join(mediaDir, tag);
		fs.mkdirSync(newDir, { recursive: true });
		console.log(`Created folder: ${tag}`);
		createdCount++;
	}
});

if (createdCount === 0) {
	console.log('All project folders already exist');
} else {
	console.log(`Created ${createdCount} folder(s)`);
}
