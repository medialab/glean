import type { PageServerLoad } from './$types';
import { extractYamlData } from '$lib/data/yaml';
import {
	didascaliaModules,
	ditheredMediaFilesModules,
	mediaFilesModules,
	subGalleryModules
} from '$lib/medias';
import type { ImageMetadata, YamlTextModule } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';
import { getProjectFilesByTag } from '$lib/media/project-files';
import { isImageMetadata } from '$lib/media/guards';
import { buildDidascaliaByStem } from '$lib/media/didascalia';

type ProjectMediaFile = ImageMetadata | { default: string };
type MediaFileLoader = () => Promise<ImageMetadata | string>;
type ImageMetadataLoader = () => Promise<ImageMetadata>;
type YamlTextLoader = () => Promise<string>;

const resolveProjectMediaFiles = async (
	projectTag: string
): Promise<Record<string, ProjectMediaFile>> => {
	const projectLoaders = getProjectFilesByTag(
		mediaFilesModules as Record<string, MediaFileLoader>,
		projectTag
	);
	const entries = await Promise.all(
		Object.entries(projectLoaders).map(async ([key, loader]) => {
			const loaded = await loader();
			return typeof loaded === 'string'
				? ([key, { default: loaded }] as const)
				: ([key, loaded] as const);
		})
	);
	return Object.fromEntries(entries);
};

const resolveProjectImageFiles = async (
	loaderMap: Record<string, ImageMetadataLoader>,
	projectTag: string
): Promise<Record<string, ImageMetadata>> => {
	const projectLoaders = getProjectFilesByTag(loaderMap, projectTag);
	const entries = await Promise.all(
		Object.entries(projectLoaders).map(async ([key, loader]) => [key, await loader()] as const)
	);
	return Object.fromEntries(entries);
};

const resolveProjectDidascaliaEntries = async (
	projectTag: string
): Promise<Record<string, YamlTextModule>> => {
	const projectLoaders = getProjectFilesByTag(
		didascaliaModules as Record<string, YamlTextLoader>,
		projectTag
	);
	const entries = await Promise.all(
		Object.entries(projectLoaders).map(
			async ([key, loader]) => [key, { default: await loader() }] as const
		)
	);
	return Object.fromEntries(entries);
};

export function entries() {
	const data = extractYamlData();
	if (!data) {
		return [];
	}
	return data.projects.map((project) => ({
		project: project.tag
	}));
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const data = extractYamlData();

		if (!data) {
			throw error(500, 'Failed to load data');
		}

		const project = data.projects.find((p) => p.tag === params.project);

		if (!project) {
			throw error(404, 'Project not found');
		}

		const projectMediaFiles = await resolveProjectMediaFiles(project.tag);
		const subGalleryMediaFiles = await resolveProjectImageFiles(
			subGalleryModules as Record<string, ImageMetadataLoader>,
			project.tag
		);
		const didascaliaEntries = await resolveProjectDidascaliaEntries(project.tag);
		const didascaliaByStem = buildDidascaliaByStem(didascaliaEntries);
		const ditheredProjectMediaFiles = await resolveProjectImageFiles(
			ditheredMediaFilesModules as Record<string, ImageMetadataLoader>,
			project.tag
		);

		const sourceThumbEntry = Object.entries(projectMediaFiles).find(
			([key, value]) => key.toLowerCase().includes('thumb') && isImageMetadata(value)
		);
		const sourceThumbKey = sourceThumbEntry?.[0];
		const thumbnailSrc =
			sourceThumbEntry && isImageMetadata(sourceThumbEntry[1]) ? sourceThumbEntry[1].src : null;

		const ditherThumbKey = sourceThumbKey
			? sourceThumbKey.replace('/media/', '/ditheredMedia/').replace(/\.\w+$/, '.png')
			: null;
		const ditherThumbnailSrc =
			(ditherThumbKey ? ditheredProjectMediaFiles[ditherThumbKey]?.src : null) ??
			Object.entries(ditheredProjectMediaFiles).find(([key]) =>
				key.toLowerCase().includes('thumb')
			)?.[1].src ??
			null;

		return {
			project,
			projectMediaFiles,
			subGalleryMediaFiles,
			didascaliaByStem,
			thumbnailSrc,
			ditherThumbnailSrc
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
