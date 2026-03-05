import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { load as yamlLoad } from 'js-yaml';
import type { YamlData } from '$lib/types';

const isYamlData = (value: unknown): value is YamlData => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'projects' in value &&
		Array.isArray((value as { projects?: unknown }).projects)
	);
};

let cachedYamlData: YamlData | undefined;
let cachedYamlMtimeMs: number | undefined;

export const extractYamlData = (): YamlData | undefined => {
	try {
		const yamlPath = resolve(process.cwd(), 'src/lib/dataset/main.yaml');
		const mtimeMs = statSync(yamlPath).mtimeMs;

		if (cachedYamlData && cachedYamlMtimeMs === mtimeMs) {
			return cachedYamlData;
		}

		const text = readFileSync(yamlPath, 'utf8');
		const data = yamlLoad(text);

		if (!isYamlData(data)) {
			throw new Error('Invalid main.yaml format: expected an object with a projects array.');
		}

		cachedYamlData = data;
		cachedYamlMtimeMs = mtimeMs;

		return cachedYamlData;
	} catch (error) {
		cachedYamlData = undefined;
		cachedYamlMtimeMs = undefined;
		console.error('Error loading YAML data:', error);
		return undefined;
	}
};
