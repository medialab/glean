import type { PageServerLoad } from './$types';
import { extractYamlData } from '$lib/data/yaml';
import { homeMediaMetadataLoaders, homeDitheredMediaMetadataLoaders } from '$lib/utils/medias';
import type { HomeCardDTO, ImageMetadata, Project, YamlData } from '$lib/utils/types';
import { normalizeImageMetadata } from '$lib/media/guards';
import { getProjectImageKeys } from '$lib/media/project-files';

type MediaMetadataLoader = () => Promise<ImageMetadata | { default: ImageMetadata }>;

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
	const sourceKeys = getProjectImageKeys(homeMediaMetadataLoaders, project.tag);
	const ditheredKeys = getProjectImageKeys(homeDitheredMediaMetadataLoaders, project.tag);

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

export const load: PageServerLoad = async () => {
	try {
		const data: YamlData = extractYamlData() ?? { projects: [] };
		const cards = (
			await Promise.all(data.projects.map((project) => buildHomeCard(project)))
		).filter((card): card is HomeCardDTO => card !== null);

		return {
			cards
		};
	} catch (error) {
		console.error('Error loading YAML data:', error);
		return {
			cards: []
		};
	}
};
