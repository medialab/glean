export const SITE_NAME = 'Design Team Portfolio';
export const SITE_DESCRIPTION =
	'A curated collection of design projects showcasing innovative work across disciplines.';
export const SITE_ORIGIN = 'https://medialab.github.io';
export const SITE_BASE_PATH = '/glean';

const ensureLeadingSlash = (value: string): string => (value.startsWith('/') ? value : `/${value}`);

const normalizeRoutePath = (value: string): string => {
	if (!value || value === '/') {
		return '/';
	}

	return ensureLeadingSlash(value).replace(/\/+$/, '');
};

const normalizeBasePath = (): string => {
	const trimmed = SITE_BASE_PATH.replace(/^\/+|\/+$/g, '');
	return trimmed ? `/${trimmed}` : '';
};

export const buildCanonicalUrl = (path = '/'): string => {
	const routePath = normalizeRoutePath(path);
	const fullPath = `${normalizeBasePath()}${routePath}`;
	return `${SITE_ORIGIN}${fullPath}`;
};

export const toAbsoluteUrl = (urlOrPath: string): string => {
	if (/^https?:\/\//i.test(urlOrPath)) {
		return urlOrPath;
	}

	return `${SITE_ORIGIN}${ensureLeadingSlash(urlOrPath)}`;
};

export const DEFAULT_OG_IMAGE = buildCanonicalUrl('/og/og.png');
