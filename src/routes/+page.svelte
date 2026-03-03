<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { PageProps } from './$types';
	import type { MousePosition, ImageMetadata } from '$lib/types';
	import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, buildCanonicalUrl } from '$lib/seo';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { stackObtainer, findThumbnailImage } from '$lib/utils';

	let { data }: PageProps = $props();

	const pageTitle = SITE_NAME;
	const pageDescription = SITE_DESCRIPTION;
	const pageUrl = buildCanonicalUrl('/');
	const pageImage = DEFAULT_OG_IMAGE;
	const cardPreloadPromises = new Map<string, Promise<void>>();

	const mousePosition = writable<MousePosition>({ x: 0, y: 0 });

	const preloadImage = (src: string): Promise<void> => {
		if (typeof window === 'undefined') {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			const img = new Image();
			const done = () => resolve();
			img.onload = done;
			img.onerror = done;
			img.src = src;

			if (img.complete) {
				resolve();
			}
		});
	};

	const preloadCardAssets = (
		projectTag: string,
		thumbSrc: string,
		stack: Record<string, ImageMetadata>
	): Promise<void> => {
		const existing = cardPreloadPromises.get(projectTag);
		if (existing) {
			return existing;
		}

		const sources = [thumbSrc, ...Object.values(stack).map((media) => media.src)];
		const uniqueSources = [...new Set(sources.filter(Boolean))];
		const promise = Promise.all(uniqueSources.map((src) => preloadImage(src))).then(
			() => undefined
		);
		cardPreloadPromises.set(projectTag, promise);

		return promise;
	};

	const trackMousePosition = () => {
		const updateMousePosition = (event: MouseEvent) => {
			mousePosition.set({
				x: event.clientX,
				y: event.clientY
			});

			// Normalize to [-1, 1] relative to viewport center and expose as CSS vars
			if (typeof window !== 'undefined') {
				const vw = window.innerWidth || 1;
				const vh = window.innerHeight || 1;
				const nx = (event.clientX / vw) * 2 - 1;
				const ny = (event.clientY / vh) * 2 - 1;
				const root = document.documentElement;
				root.style.setProperty('--mx', String(nx));
				root.style.setProperty('--my', String(ny));
			}
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('mousemove', updateMousePosition);

			return () => {
				window.removeEventListener('mousemove', updateMousePosition);
			};
		}

		return () => {};
	};

	let cleanupMouseTracking: (() => void) | null = null;

	onMount(() => {
		cleanupMouseTracking = trackMousePosition();
	});

	onDestroy(() => {
		if (cleanupMouseTracking) {
			cleanupMouseTracking();
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:alt" content="Design Team Portfolio preview" />

	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content="Design Team Portfolio preview" />
</svelte:head>

<section class="cards_container">
	{#each data.projects as project, index}
		{@const ditheredMediaModules = data.ditheredMediaFilesModules ?? {}}
		{@const sourceMediaModules = data.mediaFilesModules ?? {}}
		{@const ditheredStack = stackObtainer(ditheredMediaModules, project.tag)}
		{@const sourceStack = stackObtainer(sourceMediaModules, project.tag)}
		{@const stack = Object.keys(ditheredStack).length > 0 ? ditheredStack : sourceStack}
		{@const thumb =
			findThumbnailImage(ditheredMediaModules, project.tag) ??
			findThumbnailImage(sourceMediaModules, project.tag)}
		{#if project.tag && thumb}
			{@const readyPromise = preloadCardAssets(project.tag, thumb.src, stack)}
			<Card
				isMobile={data.deviceType.isMobile}
				thumbnail={thumb}
				tag={project.tag}
				title={project.title}
				year_begin={project.year_begin}
				year_end={project.year_end}
				team_people={project.team_people}
				imageStack={stack}
				mousePosition={$mousePosition}
				{index}
				translateMultiplier={100}
				scaleStrength={1}
				assetsReady={readyPromise}
			/>
		{/if}
	{/each}
</section>

<style>
	.cards_container {
		width: 100%;
		height: fit-content;

		padding: var(--spacing-l);
		margin-top: var(--spacing-xl);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--spacing-l);
		justify-content: flex-start;
	}

	@media (max-width: 768px) {
		.cards_container {
			width: 100%;
			padding: var(--spacing-m);
			margin-top: 0px;
			flex-direction: column;
			height: max-content;
			row-gap: var(--spacing-l);
		}
	}
</style>
