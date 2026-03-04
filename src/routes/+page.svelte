<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { PageProps } from './$types';
	import type { MousePosition } from '$lib/types';
	import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, buildCanonicalUrl } from '$lib/seo';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { stackObtainer, findThumbnailImage } from '$lib/utils';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	const pageTitle = SITE_NAME;
	const pageDescription = SITE_DESCRIPTION;
	const pageUrl = buildCanonicalUrl('/');
	const pageImage = DEFAULT_OG_IMAGE;
	const THUMBNAIL_FALLBACK_TIMEOUT_MS = 1200;
	const thumbnailReadyPromises = new Map<string, Promise<void>>();

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

	const wait = (ms: number): Promise<void> => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	const preloadThumbnail = (projectTag: string, thumbSrc: string): Promise<void> => {
		const existing = thumbnailReadyPromises.get(projectTag);
		if (existing) {
			return existing;
		}

		const promise = Promise.race([
			preloadImage(thumbSrc),
			wait(THUMBNAIL_FALLBACK_TIMEOUT_MS)
		]).then(() => undefined);
		thumbnailReadyPromises.set(projectTag, promise);

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

	let isPageLoaded = $state(false);

	onMount(() => {
		cleanupMouseTracking = trackMousePosition();
		isPageLoaded = true;
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

<section class="home_header md:home_header hidden">
	<div
		class:revealHidden={!isPageLoaded}
		class:revealShown={isPageLoaded}
		class="w-[90%] flex flex-col gap-2"
	>
		<h1 class:revealHidden={!isPageLoaded} class:revealShown={isPageLoaded}>
			This is the portfolio of the <u
				><a href={resolve('/about')}>Collective Inquiries and Inventive Formats group </a></u
			> @ médialab Sciences Po
		</h1>
		<p class="notes" class:revealHidden={!isPageLoaded} class:revealShown={isPageLoaded}>
			All the projects listed are part of the collective effort of conducting participatory
			inquiries via design-first methods.
		</p>
	</div>
</section>

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
			{@const readyPromise = preloadThumbnail(project.tag, thumb.src)}
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
				thumbnailReady={readyPromise}
			/>
		{/if}
	{/each}
</section>

<style>
	.cards_container {
		width: 100%;
		height: fit-content;

		padding: calc(var(--spacing) * 10);
		margin-top: calc(var(--spacing) * 20);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: calc(var(--spacing) * 10);
		justify-content: flex-start;
	}

	@media (max-width: 768px) {
		.cards_container {
			width: 100%;
			padding: calc(var(--spacing) * 5);
			margin-top: 0px;
			flex-direction: column;
			height: max-content;
			row-gap: calc(var(--spacing) * 10);
		}

		.home_header {
			display: flex;
			height: 90dvh;
			width: 100%;
			align-items: center;
			justify-content: start;
			padding: 20px;
			z-index: 1;
		}
	}

	.home_header {
		display: hidden !important;
	}
</style>
