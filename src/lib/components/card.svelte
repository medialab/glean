<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import type { CardProps, CardVec2 } from '$lib/types';
	import { fly } from 'svelte/transition';

	let props: CardProps = $props();
	const dispatch = createEventDispatcher<{
		hoverchange: {
			index: number;
			hovered: boolean;
		};
	}>();
	type CardSize = 's' | 'm' | 'l' | 'xl';

	let cardEl: HTMLAnchorElement | null = null;

	let farness = $state(0);
	let isHovered = $state(false);
	let isThumbnailLoaded = $state(false);
	let splitVectors = $state<CardVec2[]>([]);
	const stackPreview = $derived(props.stackPreview ?? []);
	const titleLength = $derived((props.title ?? '').trim().length);
	const thumbnailSrc = $derived(props.thumbnail?.src ?? null);

	const cardSize = $derived.by<CardSize>(() => {
		if (titleLength <= 12) return 's';
		if (titleLength <= 24) return 'm';
		if (titleLength <= 36) return 'l';
		return 'xl';
	});
	const cardSizeMaxWidth = $derived.by(() => {
		if (cardSize === 's') return '22ch';
		if (cardSize === 'm') return '28ch';
		if (cardSize === 'l') return '34ch';
		return '40ch';
	});
	const ra = $derived.by(() => {
		if (cardSize === 's') return '1/1';
		if (cardSize === 'm') return '5/4';
		if (cardSize === 'l') return '4/3';
		return '3/4';
	});

	const cardScale = $derived.by(() => {
		if (props.isMobile) return 1;
		const minScale = Math.max(0, props.minScale ?? 0.7);
		const maxScale = Math.max(minScale, props.maxScale ?? 1);
		return maxScale - (maxScale - minScale) * farness;
	});

	const cardTransform = $derived.by(() => {
		if (props.isMobile) return 'none';
		return `translateY(var(--card-hover-y, 0px)) scale(${cardScale})`;
	});
	const cardOpacity = $derived.by(() => (props.isMobile ? 1 : props.isDimmed ? 0.2 : 1));
	const hoverSpread = $derived.by(() => (props.isMobile || !isHovered ? 0 : 1));

	const limitTranslation = (v: number) => Math.max(0, Math.min(1, v));

	const logScale = (n: number, k: number) => {
		const kk = Math.max(0.0001, k);
		return Math.log1p(kk * n) / Math.log1p(kk);
	};

	const SPLIT_VECTOR_COUNT = 24;
	const circularSplitVectors = Array.from({ length: SPLIT_VECTOR_COUNT }, (_, index) => {
		const angle = (index / SPLIT_VECTOR_COUNT) * Math.PI * 2;
		return { x: Math.cos(angle), y: Math.sin(angle) };
	});

	const createRandomSplitVectors = (count: number): CardVec2[] =>
		Array.from({ length: count }, () => {
			const randomIndex = Math.floor(Math.random() * circularSplitVectors.length);
			return circularSplitVectors[randomIndex];
		});

	const ensureSplitVectors = (count: number) => {
		if (splitVectors.length === count) return;
		splitVectors = createRandomSplitVectors(count);
	};

	const reseedSplitVectors = () => {
		splitVectors = createRandomSplitVectors(stackPreview.length);
	};

	const splitTransform = (stackIndex: number): string => {
		const total = Math.max(1, stackPreview.length);
		const direction =
			splitVectors[stackIndex] ?? circularSplitVectors[stackIndex % circularSplitVectors.length];
		const spread = (props.translateMultiplier ?? 14) * ((stackIndex + 1) / total) * hoverSpread;
		return `translate(${direction.x * spread}px, ${direction.y * spread}px)`;
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
		// react to mouse movement
		void props.mousePosition;
		updateFarness();
	});

	$effect(() => {
		ensureSplitVectors(stackPreview.length);
	});

	$effect(() => {
		isThumbnailLoaded = !thumbnailSrc;
	});

	const setThumbnailLoaded = () => {
		isThumbnailLoaded = true;
	};

	const setCardHoverState = (hovered: boolean) => {
		if (props.isMobile) return;
		if (hovered && !isHovered) {
			reseedSplitVectors();
		}
		isHovered = hovered;
		dispatch('hoverchange', { index: props.index, hovered });
	};

	const thumbnailLoadingMode = $derived(props.index < 2 ? 'eager' : 'lazy');
	const thumbnailFetchPriority = $derived(props.index < 2 ? 'high' : 'low');
</script>

<a
	bind:this={cardEl}
	class="group [--card-hover-y:0px] flex h-[14vh] w-fit flex-row items-center justify-start gap-0 bg-[var(--primary-white)] [transform-origin:left_center] transition-opacity duration-250 [transition-timing-function:var(--curve)] hover:[--card-hover-y:-2px] max-md:relative max-md:h-fit max-md:w-full max-md:flex-col max-md:items-start max-md:bg-transparent"
	href={resolve('/[project]', { project: props.tag })}
	onpointerenter={() => setCardHoverState(true)}
	onpointerleave={() => setCardHoverState(false)}
	onfocus={() => setCardHoverState(true)}
	onblur={() => setCardHoverState(false)}
	style="transform: {cardTransform}; will-change: {props.isMobile
		? 'auto'
		: 'transform, opacity'}; transform-style: {props.isMobile
		? 'flat'
		: 'preserve-3d'}; opacity: {cardOpacity};"
>
	<div
		class="relative z-[5] h-full max-h-full self-center max-md:h-auto max-md:max-h-[25vh] max-md:w-full max-md:aspect-[16/9]"
		style="aspect-ratio: {ra};"
		in:fade={{ duration: 260 }}
	>
		<!-- This is the thumn fixed that shows on hover -->
		{#if thumbnailSrc}
			<enhanced:img
				src={thumbnailSrc}
				alt={props.title}
				loading={thumbnailLoadingMode}
				fetchpriority={thumbnailFetchPriority}
				crossorigin="anonymous"
				onload={setThumbnailLoaded}
				onerror={setThumbnailLoaded}
				class="static z-[1] h-full w-full object-cover opacity-100 transition-opacity duration-200 [filter:grayscale(1)_contrast(2)_brightness(1.1)] [transition-timing-function:var(--curve)]"
			/>
		{/if}

		{#if !isThumbnailLoaded}
			<div
				class="absolute inset-0 z-[10] flex h-full max-h-full items-center justify-center bg-[var(--permanent-white)]"
			>
				<p class="notes animate-pulse text-[var(--permanent-black)]">Loading...</p>
			</div>
		{/if}

		<!-- This is the stack of images that shows on hover -->
		{#if !props.isMobile}
			<div
				class="pointer-events-none absolute inset-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-250 [transition-timing-function:var(--curve)] group-hover:opacity-100 max-md:invisible max-md:hidden"
			>
				{#if stackPreview.length > 0}
					{#each stackPreview as image, stackIndex}
						<enhanced:img
							src={image.src}
							loading="lazy"
							fetchpriority="low"
							alt={props.title}
							style={`z-index: ${stackIndex + 1}; transform: ${splitTransform(stackIndex)}; transition-delay: ${stackIndex * 100}ms;`}
							class="absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-300 [transition-timing-function:var(--curve)]"
						/>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	<div
		class="z-10 flex h-full w-fit flex-col items-start justify-center gap-2.5 p-2.5 max-md:relative max-md:w-full bg-surface"
		style={`max-width: ${props.isMobile ? 'none' : cardSizeMaxWidth};`}
		in:fade={{ duration: 260 }}
	>
		<h2
			id="title_container"
			class="w-full bg-surface [display:-webkit-box] overflow-visible text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [line-clamp:3] max-md:w-[95%]"
			in:fly={{ y: 16, duration: 650, delay: 60 }}
		>
			{props.title}
		</h2>
		<div class="bg-surface" in:fly={{ y: 16, duration: 650, delay: 110 }}>
			{#if props.year_end}
				<p class="notes"><b>Period:</b> {props.year_begin} - {props.year_end}</p>
			{:else}
				<p class="notes"><b>Year:</b> {props.year_begin}</p>
			{/if}
			{#if props.team_people}
				<p
					class="notes [display:-webkit-box] overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [line-clamp:2]"
					id="people"
				>
					<b>Team:</b>
					{props.team_people}
				</p>
			{/if}
		</div>
	</div>
</a>
