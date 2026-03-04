import type { PageServerLoad } from './$types';
import { extractYamlData, genericProjectFileObtainer } from '$lib/functions';
import {
	didascaliaModules,
	ditheredMediaFilesModules,
	mediaFilesModules,
	subGalleryModules
} from '$lib/medias';
import type { ImageMetadata, YamlTextModule } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';

type ProjectMediaFile = ImageMetadata | { default: string };
type MediaFileLoader = () => Promise<ImageMetadata | string>;
type ImageMetadataLoader = () => Promise<ImageMetadata>;
type YamlTextLoader = () => Promise<string>;

const isImageMetadata = (value: unknown): value is ImageMetadata => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'src' in value &&
		'width' in value &&
		'height' in value
	);
};

const resolveProjectMediaFiles = async (
	projectTag: string
): Promise<Record<string, ProjectMediaFile>> => {
	const projectLoaders = genericProjectFileObtainer(
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
	const projectLoaders = genericProjectFileObtainer(loaderMap, projectTag);
	const entries = await Promise.all(
		Object.entries(projectLoaders).map(async ([key, loader]) => [key, await loader()] as const)
	);
	return Object.fromEntries(entries);
};

const resolveProjectDidascaliaEntries = async (
	projectTag: string
): Promise<Record<string, YamlTextModule>> => {
	const projectLoaders = genericProjectFileObtainer(
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

		const projectMediaFiles = await resolveProjectMediaFiles(project.tag);
		const subGalleryMediaFiles = await resolveProjectImageFiles(
			subGalleryModules as Record<string, ImageMetadataLoader>,
			project.tag
		);
		const didascaliaEntries = await resolveProjectDidascaliaEntries(project.tag);
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
			didascaliaEntries,
			thumbnailSrc,
			ditherThumbnailSrc,
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
