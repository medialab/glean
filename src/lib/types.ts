export type Project = {
	title: string;
	description: string;
	link: string;
	tag: string;
	year_begin: string;
	year_end?: string;
	project_type?: string;
	team_people?: string;
	author?: string;
	[key: string]: string | undefined;
};

export type DeviceType = {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
};

export type YamlData = {
	projects: Project[];
	[key: string]: unknown;
};

export type YamlTextModule = {
	default: string;
};

export type ImageShape = 'Horizontal' | 'Vertical' | 'Square';

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: string;
	default: string;
	space?: string;
	channels?: number;
	hasAlpha?: boolean;
	hasTransparency?: boolean;
	isOpaque?: boolean;
	orientation?: number;
	density?: number;
	hasProfile?: boolean;
	palette?: object;
	background?: string | { r: number; g: number; b: number; alpha?: number };
};

export type OptimizedImage = {
	img: string;
	sources: {
		avif: string;
		webp: string;
	};
};

export type MousePosition = {
	x: number;
	y: number;
};

export type TrailPoint = {
	x: number;
	y: number;
	t: number;
};

export type CardVec2 = {
	x: number;
	y: number;
};

export type CardProps = {
	isMobile: boolean;
	thumbnail: { src: string; shape: ImageShape } | null;
	tag: string;
	title: string;
	year_begin: string;
	year_end: string | undefined;
	team_people: string | undefined;
	imageStack?: Record<string, ImageMetadata>;
	mousePosition?: MousePosition;
	index: number;
	translateMultiplier?: number;
	scaleStrength?: number;
	thumbnailReady?: Promise<void>;
};

export type HeaderType = 'home' | 'about' | 'project';

export type HeaderProps = {
	type: HeaderType;
	isAbout?: boolean;
	tag?: string;
};

export type PdfWrapperProps = {
	mediafile: ImageMetadata;
	scale: number;
	twoPage: boolean;
};
