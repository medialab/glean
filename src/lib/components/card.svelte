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
	const cardSizeWidthClass = $derived.by(() => {
		if (cardSize === 's') return 'max-w-[22ch]';
		if (cardSize === 'm') return 'max-w-[28ch]';
		if (cardSize === 'l') return 'max-w-[34ch]';
		return 'max-w-[40ch]';
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
	class="group [--card-hover-y:0px] flex h-[14vh] w-fit flex-row items-center justify-start gap-0 [transform-origin:left_center] hover:[--card-hover-y:-2px] max-md:relative max-md:h-fit max-md:w-full max-md:flex-col max-md:items-start max-md:bg-transparent"
	href={resolve('/[project]', { project: props.tag })}
	style="transform: {cardTransform}; will-change: {props.isMobile
		? 'auto'
		: 'transform'}; transform-style: {props.isMobile
		? 'flat'
		: 'preserve-3d'}; background-color: {isPageLoaded ? 'var(--primary-white)' : 'transparent'};"
>
	{#if !isThumbnailReady}
		<div
			class="relative z-[5] flex h-full max-h-full items-center justify-center self-center bg-[var(--permanent-white)] max-md:h-auto max-md:max-h-[25vh] max-md:w-full max-md:aspect-[16/9]"
			style="aspect-ratio: {ra};"
		>
			<p class="notes animate-pulse text-[var(--permanent-black)]">Loading...</p>
		</div>
	{:else}
		<div
			class="relative z-[5] h-full max-h-full self-center max-md:h-auto max-md:max-h-[25vh] max-md:w-full max-md:aspect-[16/9]"
			style="aspect-ratio: {ra};"
			in:fade={{ duration: 260 }}
		>
			{#if props.thumbnail?.src}
				<enhanced:img
					src={props.thumbnail.src}
					alt={props.title}
					data-sveltekit-preload-data="eager"
					loading="eager"
					fetchpriority="high"
					crossorigin="anonymous"
					id="THUMBNAIL_IMAGE"
					class="static z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-200 [filter:grayscale(1)_contrast(2)_brightness(1.1)] [transition-timing-function:var(--curve)] group-hover:opacity-100 max-md:opacity-100"
				/>
			{/if}

			{#if !props.isMobile}
				<div
					class="pointer-events-none absolute inset-0 z-[-1] h-full w-full opacity-100 transition-opacity duration-200 [transition-timing-function:var(--curve)] group-hover:opacity-0 max-md:invisible max-md:hidden"
				>
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
								class="absolute inset-0 h-full w-full object-cover opacity-100 [filter:grayscale(1)_contrast(2)] [mix-blend-mode:darken]"
							/>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	<div
		class={`z-10 flex h-full w-fit flex-col items-start justify-center gap-2.5 p-2.5 ${cardSizeWidthClass} max-md:relative max-md:w-full max-md:max-w-none`}
		in:fade={{ duration: 260 }}
	>
		<h2
			id="title_container"
			class="w-full bg-inverse [display:-webkit-box] overflow-visible text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [line-clamp:3] max-md:w-[95%]"
			class:revealHidden={!isPageLoaded}
			class:revealShown={isPageLoaded}
		>
			{props.title}
		</h2>
		<div class="bg-inverse" class:revealHidden={!isPageLoaded} class:revealShown={isPageLoaded}>
			{#if props.year_end}
				<p class="notes">Period: {props.year_begin} - {props.year_end}</p>
			{:else}
				<p class="notes">{props.year_begin}</p>
			{/if}
			{#if props.team_people}
				<p
					class="notes [display:-webkit-box] overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [line-clamp:2]"
					id="people"
				>
					Team: {props.team_people}
				</p>
			{/if}
		</div>
	</div>
</a>
