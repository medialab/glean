import { load as yamlLoad } from 'js-yaml';
import type { YamlTextModule } from '$lib/types';

const fileStem = (pathOrName: string): string | null => {
	const baseName = pathOrName.split('/').pop();
	if (!baseName) return null;
	const withoutExt = baseName.replace(/\.[^.]+$/, '');
	return withoutExt || null;
};

const parseDescription = (rawContent: string): string | null => {
	if (!rawContent.length) return null;

	try {
		const parsed = yamlLoad(rawContent) as { imgDescription?: string };
		return typeof parsed.imgDescription === 'string' && parsed.imgDescription.trim().length > 0
			? parsed.imgDescription
			: null;
	} catch {
		return null;
	}
};

export const buildDidascaliaByStem = (
	entries: Record<string, YamlTextModule>
): Record<string, string> => {
	const result: Record<string, string> = {};

	for (const [path, module] of Object.entries(entries)) {
		const stem = fileStem(path);
		if (!stem) continue;

		const description = parseDescription(module.default ?? '');
		if (!description) continue;

		result[stem] = description;
	}

	return result;
};

export const stemFromFilePath = (pathOrName: string): string | null => fileStem(pathOrName);
