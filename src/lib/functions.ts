//This file is responsible for extracting the yaml data from the main.yaml file

import { resolve } from 'path';
import { readFileSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import type { ImageMetadata } from './medias';

type Project = {
	tag: string;
	[key: string]: any;
};

export type YamlData = {
	projects: Project[];
	[key: string]: any;
};

export const extractYamlData = (): YamlData | undefined => {
	try {
		const yamlPath = resolve(process.cwd(), 'src/lib/dataset/main.yaml');
		const text = readFileSync(yamlPath, 'utf8');
		const data = yamlLoad(text) as YamlData;

		return data;
	} catch (error) {
		console.error('Error loading YAML data:', error);
		return undefined;
	}
};

export const projectMediaFilesObtainer = <T> (
	mediaFilesModules: Record<string, T>,
	projectTag: string
): Record<string, T> => {
	return Object.keys(mediaFilesModules)
		.filter((key) => key.includes(`/${projectTag}/`))
		.reduce((obj: Record<string, T>, key) => {
			obj[key] = mediaFilesModules[key];
			return obj;
		}, {});
}; //generic filtering project_based
