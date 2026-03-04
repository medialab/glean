<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import type { CardProps, CardVec2, ImageShape } from '$lib/types';

	let props: CardProps = $props();
	type CardSize = 's' | 'm' | 'l' | 'xl';

	let ra: string = $state('4/3');

	//fallback randomic
	const shapes: ImageShape[] = ['Horizontal', 'Vertical', 'Square'];
	const shape = shapes[Math.floor(Math.random() * shapes.length)];
	if (shape === 'Vertical') {
		ra = '3/4';
	} else if (shape === 'Horizontal') {
		ra = '4/3';
	} else if (shape === 'Square') {
		ra = '1/1';
	}

	let cardEl: HTMLAnchorElement | null = null;

	let layerVectors = $state<CardVec2[]>([]);
	let farness = $state(0);
	let isThumbnailReady = $state(false);
	const titleLength = $derived((props.title ?? '').trim().length);
	const cardSize = $derived.by<CardSize>(() => {
		if (titleLength <= 12) return 's';
		if (titleLength <= 24) return 'm';
		if (titleLength <= 36) return 'l';
		return 'xl';
	});

	const cardTransform = $derived.by(() => {
		if (props.isMobile) return 'none';
		return `translateY(var(--card-hover-y, 0px)) scale(${1 + 0.1 * -farness})`;
	});

	const limitTranslation = (v: number) => Math.max(0, Math.min(1, v));

	const logScale = (n: number, k: number) => {
		// Maps n in [0,1] to [0,1] with a logarithmic curve controlled by k>0
		// Higher k increases curvature: slower near 0, faster near 1
		const kk = Math.max(0.0001, k);
		return Math.log1p(kk * n) / Math.log1p(kk);
	};

	const ensureLayerVectors = (count: number) => {
		if (layerVectors.length === count) return;
		const vectors: CardVec2[] = [];
		for (let i = 0; i < count; i++) {
			const mode = Math.floor(Math.random() * 3); // 0: x, 1: y, 2: both
			const rx = mode === 1 ? 0 : Math.random() * 2 - 1;
			const ry = mode === 0 ? 0 : Math.random() * 2 - 1;
			vectors.push({ x: rx, y: ry });
		}
		layerVectors = vectors;
	};

	const updateFarness = () => {
		if (typeof window === 'undefined' || !cardEl) {
			farness = 0;
			return;
		}

		const rect = cardEl.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const mx = props.mousePosition?.x ?? cx;
		const my = props.mousePosition?.y ?? cy;
		const dist = Math.hypot(mx - cx, my - cy);
		const maxDist = Math.hypot(window.innerWidth, window.innerHeight) / 2;
		const n = limitTranslation(dist / (maxDist || 1));
		const k = props.scaleStrength ?? 4;
		farness = limitTranslation(logScale(n, k));
	};

	$effect(() => {
		const stacksCount =
			props.imageStack && Object.keys(props.imageStack).length > 0
				? Object.keys(props.imageStack).length
				: 5;
		ensureLayerVectors(stacksCount);
	});

	$effect(() => {
		// react to mouse movement
		void props.mousePosition;
		updateFarness();
	});

	$effect(() => {
		const readyPromise = props.thumbnailReady;
		if (!readyPromise) {
			isThumbnailReady = true;
			return;
		}

		isThumbnailReady = false;
		let isActive = true;
		void readyPromise.finally(() => {
			if (!isActive) return;
			isThumbnailReady = true;
		});

		return () => {
			isActive = false;
		};
	});

	let isPageLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			isPageLoaded = true;
		}, 10);
	});
</script>

<a
	bind:this={cardEl}
	class="card_container"
	href={resolve('/[project]', { project: props.tag })}
	style="transform: {cardTransform}; will-change: {props.isMobile
		? 'auto'
		: 'transform'}; transform-style: {props.isMobile
		? 'flat'
		: 'preserve-3d'}; background-color: {isPageLoaded ? 'var(--primary-white)' : 'transparent'};"
>
	{#if !isThumbnailReady}
		<div class="image_container card_loading_image" style="aspect-ratio: {ra};">
			<p class="notes card_loading_text">Loading...</p>
		</div>
	{:else}
		<div class="image_container" style="aspect-ratio: {ra};" in:fade={{ duration: 260 }}>
			{#if props.thumbnail?.src}
				<enhanced:img
					src={props.thumbnail.src}
					alt={props.title}
					data-sveltekit-preload-data="eager"
					loading="eager"
					fetchpriority="high"
					crossorigin="anonymous"
					id="THUMBNAIL_IMAGE"
				/>
			{/if}

			{#if !props.isMobile}
				<div class="image_stack">
					{#if props.imageStack && Object.keys(props.imageStack).length > 0}
						{#each Object.keys(props.imageStack) as imageKey, index}
							<enhanced:img
								src={props.imageStack[imageKey].src}
								loading="lazy"
								fetchpriority="low"
								alt={props.title}
								style="z-index: {index + 1}; transform: translate({(layerVectors[index]?.x ?? 0) *
									(props.translateMultiplier ?? 14) *
									farness *
									((index + 1) / Object.keys(props.imageStack).length)}px, {(layerVectors[index]
									?.y ?? 0) *
									(props.translateMultiplier ?? 14) *
									farness *
									((index + 1) / Object.keys(props.imageStack).length)}px);"
							/>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	<div class={`info_container info_container--${cardSize}`} in:fade={{ duration: 260 }}>
		<h2 id="title_container" class:revealHidden={!isPageLoaded} class:revealShown={isPageLoaded}>
			{props.title}
		</h2>
		<div
			class="specifications_container"
			class:revealHidden={!isPageLoaded}
			class:revealShown={isPageLoaded}
		>
			{#if props.year_end}
				<p class="notes">Period: {props.year_begin} - {props.year_end}</p>
			{:else}
				<p class="notes">{props.year_begin}</p>
			{/if}
			{#if props.team_people}
				<p class="notes" id="people">Team: {props.team_people}</p>
			{/if}
		</div>
	</div>
</a>

<style>
	.card_container {
		--card-hover-y: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		column-gap: 0px;
		width: fit-content;
		height: 14vh;
		background-color: unset;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		transform-origin: left center;
	}

	.card_container:hover {
		--card-hover-y: -2px;
	}

	.image_container {
		height: 100%;
		max-height: 100%;
		position: relative;
		align-self: center;
		z-index: 5;
	}

	.card_loading_image {
		background: var(--permanent-white);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card_loading_text {
		color: var(--permanent-black);
		animation: loading-pulse 1s ease-in-out infinite;
	}

	.image_container > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: static;
		z-index: 1;
		filter: grayscale(1) contrast(2) brightness(1.1);
		opacity: 0;
	}

	.image_stack {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.2s var(--curve);
	}

	.card_container:hover .image_stack {
		opacity: 0;
		transition: opacity 0.2s var(--curve);
	}

	.card_container:hover .image_container > img {
		opacity: 1;
	}

	.image_stack > * {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 1;
		filter: grayscale(1) contrast(2);
		mix-blend-mode: darken;
	}

	.info_container {
		display: flex;
		flex-direction: column;
		row-gap: calc(var(--spacing) * 2.5);
		align-items: flex-start;
		justify-content: center;
		width: fit-content;
		padding: calc(var(--spacing) * 2.5);
		z-index: 10;
		height: 100%;
	}

	.info_container--s {
		max-width: 22ch;
	}

	.info_container--m {
		max-width: 28ch;
	}

	.info_container--l {
		max-width: 34ch;
	}

	.info_container--xl {
		max-width: 40ch;
	}

	.info_container > h2 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: visible;
		text-overflow: ellipsis;
	}

	.info_container > * {
		background-color: var(--primary-white);
	}

	#people {
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@keyframes loading-pulse {
		0% {
			opacity: 0.35;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0.35;
		}
	}

	@media (max-width: 768px) {
		.card_container {
			flex-direction: column;
			height: fit-content;
			width: 100%;
			align-items: flex-start;
			position: relative;
			transform: none;
			transition: none;
			background-color: transparent;
		}

		.image_container {
			width: 100%;
			height: auto;
			aspect-ratio: 16/9;
			max-height: 25vh;
		}

		.card_container .image_container > img {
			opacity: 1;
		}

		.info_container {
			padding: 0px;
			position: relative;
			padding: calc(var(--spacing) * 2.5);
			width: 100%;
			max-width: unset;
		}

		.info_container > h2 {
			width: 95%;
			overflow: visible;
		}

		.image_stack {
			display: none;
			visibility: hidden;
		}
	}
</style>
