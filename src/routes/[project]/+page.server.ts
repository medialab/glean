import type { PageServerLoad } from './$types';
import { extractYamlData, genericProjectFileObtainer } from '$lib/functions';
import { mediaFilesModules, subGalleryModules, didascaliaModules } from '$lib/medias';
import { error, type HttpError } from '@sveltejs/kit';

export function entries() {
	const data = extractYamlData();
	if (!data) {
		return [];
	}
	return data.projects.map((project) => ({
		project: project.tag
	}));
}

export const load: PageServerLoad = async ({ params, parent }) => {
	try {
		const data = extractYamlData();
		const { deviceType } = await parent();

		if (!data) {
			throw error(500, 'Failed to load data');
		}

		if (!deviceType) {
			throw error(500, 'Failed to load device type');
		}

		const project = data.projects.find((p) => p.tag === params.project);

		if (!project) {
			throw error(404, 'Project not found');
		}

		const projectMediaFiles = genericProjectFileObtainer(mediaFilesModules, project.tag);

		const subGalleryMediaFiles = genericProjectFileObtainer(subGalleryModules, project.tag);

		const didascaliaEntries = genericProjectFileObtainer(didascaliaModules, project.tag);

		return {
			project,
			projectMediaFiles,
			subGalleryMediaFiles,
			mediaFilesModules,
			didascaliaEntries,
			deviceType
		};
	} catch (err) {
		// Check if this is already an HttpError from SvelteKit
		if (err && typeof err === 'object' && 'status' in err) {
			const httpError = err as HttpError;
			// Log the error with context for monitoring
			console.error(
				`[${httpError.status}] Error loading project "${params.project}":`,
				httpError.body?.message || err
			);
			// Rethrow the original HttpError (preserves 404, 500, etc.)
			throw err;
		}

		// For unexpected errors (YAML parse failures, filesystem errors, etc.)
		console.error(`[500] Unexpected error loading project "${params.project}":`, err);
		// Throw a proper 500 error so operators notice real faults
		const errorMessage = err instanceof Error ? err.message : String(err);
		throw error(500, `Internal server error while loading project: ${errorMessage}`);
	}
};
