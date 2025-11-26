<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Card from '$lib/components/card.svelte';
	import type { PageProps } from './$types';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { stackObtainer, findThumbnailImage } from '$lib/utils';

	let { data }: PageProps = $props();

	type MousePosition = {
		x: number;
		y: number;
	};

	$inspect('isMobile', data.deviceType.isMobile);

	const mousePosition = writable<MousePosition>({ x: 0, y: 0 });

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
	<meta property="og:type" content="website" />
	<meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
	<meta property="og:title" content="Design Team Portfolio" />
	<meta
		property="og:description"
		content="A curated collection of design projects showcasing innovative work across disciplines."
	/>
	<meta property="og:image" content="https://design-team-portfolio.com/og-image.jpg" />
	<meta property="og:site_name" content="Design Team Portfolio" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Design Team Portfolio preview" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
	<meta name="twitter:title" content="Design Team Portfolio" />
	<meta
		name="twitter:description"
		content="A curated collection of design projects showcasing innovative work across disciplines."
	/>
	<meta name="twitter:image" content="https://design-team-portfolio.com/og-image.jpg" />
	<meta name="twitter:image:alt" content="Design Team Portfolio preview" />
	<meta name="twitter:site" content="@designteam" />
	<meta name="twitter:creator" content="@designteam" />
</svelte:head>

<Header type="home" isAbout={false} />

<section class="cards_container">
	{#each data.projects as project, index}
		{@const stack = stackObtainer(data.ditheredMediaFilesModules, project.tag)}
		{@const thumb = findThumbnailImage(data.ditheredMediaFilesModules, project.tag)}
		{#if project.tag && thumb}
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
			/>
		{/if}
	{/each}

	<Footer />
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
		row-gap: var(--spacing-l);
		justify-content: space-between;
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
