import type { PageServerLoad } from './$types';
import { extractYamlData } from '$lib/functions';
import { homeMediaMetadataLoaders, homeDitheredMediaMetadataLoaders } from '$lib/medias';
import type { DeviceType, HomeCardDTO, ImageMetadata, Project, YamlData } from '$lib/types';

const fallbackDeviceType: DeviceType = {
	isMobile: false,
	isTablet: false,
	isDesktop: true
};

const imageFilePattern = /\.(png|jpe?g|webp|gif)$/i;

type MediaMetadataLoader = () => Promise<ImageMetadata | { default: ImageMetadata }>;

const isProjectImageKey = (path: string, projectTag: string): boolean =>
	path.includes(`/${projectTag}/`) && imageFilePattern.test(path);

const isImageMetadata = (value: unknown): value is ImageMetadata => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'src' in value &&
		'width' in value &&
		'height' in value
	);
};

const normalizeImageMetadata = (value: unknown): ImageMetadata | null => {
	if (isImageMetadata(value)) return value;
	if (typeof value === 'object' && value !== null && 'default' in value) {
		const defaultValue = (value as { default?: unknown }).default;
		if (isImageMetadata(defaultValue)) return defaultValue;
	}
	return null;
};

const selectProjectImageKeys = (
	loaderMap: Record<string, MediaMetadataLoader>,
	projectTag: string
): string[] => {
	return Object.keys(loaderMap)
		.filter((path) => isProjectImageKey(path, projectTag))
		.sort((leftPath, rightPath) => leftPath.localeCompare(rightPath, 'en', { numeric: true }));
};

const metadataPromiseCache = new Map<string, Promise<ImageMetadata | null>>();

const loadImageMetadata = (
	loaderMap: Record<string, MediaMetadataLoader>,
	key: string
): Promise<ImageMetadata | null> => {
	const cached = metadataPromiseCache.get(key);
	if (cached) return cached;

	const loader = loaderMap[key];
	if (!loader) return Promise.resolve(null);

	const pending = loader()
		.then((loaded) => normalizeImageMetadata(loaded))
		.catch(() => null);

	metadataPromiseCache.set(key, pending);
	return pending;
};

const buildHomeCard = async (project: Project): Promise<HomeCardDTO | null> => {
	const sourceKeys = selectProjectImageKeys(homeMediaMetadataLoaders, project.tag);
	const ditheredKeys = selectProjectImageKeys(homeDitheredMediaMetadataLoaders, project.tag);

	const ditheredThumbKey = ditheredKeys.find((path) => path.toLowerCase().includes('thumb'));
	const sourceThumbKey = sourceKeys.find((path) => path.toLowerCase().includes('thumb'));
	const thumbnailMeta =
		(ditheredThumbKey
			? await loadImageMetadata(homeDitheredMediaMetadataLoaders, ditheredThumbKey)
			: null) ??
		(sourceThumbKey ? await loadImageMetadata(homeMediaMetadataLoaders, sourceThumbKey) : null);

	if (!thumbnailMeta) return null;

	const ditheredStackKeys = ditheredKeys
		.filter((path) => !path.toLowerCase().includes('thumb'))
		.slice(0, 3);
	const sourceStackKeys = sourceKeys
		.filter((path) => !path.toLowerCase().includes('thumb'))
		.slice(0, 3);
	const stackKeys = ditheredStackKeys.length > 0 ? ditheredStackKeys : sourceStackKeys;
	const stackLoaders =
		ditheredStackKeys.length > 0 ? homeDitheredMediaMetadataLoaders : homeMediaMetadataLoaders;
	const stackMetadata = (
		await Promise.all(stackKeys.map((key) => loadImageMetadata(stackLoaders, key)))
	).filter((meta): meta is ImageMetadata => meta !== null);

	const card: HomeCardDTO = {
		tag: project.tag,
		title: project.title,
		year_begin: project.year_begin,
		thumb: {
			src: thumbnailMeta.src,
			width: thumbnailMeta.width,
			height: thumbnailMeta.height
		},
		stackPreview: stackMetadata.map((meta) => ({
			src: meta.src,
			width: meta.width,
			height: meta.height
		}))
	};

	if (project.year_end) {
		card.year_end = project.year_end;
	}

	if (project.team_people) {
		card.team_people = project.team_people;
	}

	return card;
};

export const load: PageServerLoad = async ({ parent }) => {
	try {
		const data: YamlData = extractYamlData() ?? { projects: [] };
		const { deviceType } = await parent();
		const cards = (
			await Promise.all(data.projects.map((project) => buildHomeCard(project)))
		).filter((card): card is HomeCardDTO => card !== null);

		return {
			cards,
			deviceType
		};
	} catch (error) {
		console.error('Error loading YAML data:', error);
		return {
			cards: [],
			deviceType: fallbackDeviceType
		};
	}
};
