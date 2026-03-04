//This file is responsible for extracting the yaml data from the main.yaml file

import { resolve } from 'path';
import { readFileSync, statSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import type { YamlData } from './types';

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

export const genericProjectFileObtainer = <T>(
	mediaFilesModules: Record<string, T>,
	projectTag: string
): Record<string, T> => {
	return Object.keys(mediaFilesModules)
		.filter((key) => key.includes(`/${projectTag}/`))
		.reduce((obj: Record<string, T>, key) => {
			obj[key] = mediaFilesModules[key];
			return obj;
		}, {});
};
