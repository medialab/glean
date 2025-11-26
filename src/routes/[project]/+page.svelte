<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import PdfWrapper from '$lib/components/pdf_wrapper.svelte';

	import { findThumbnailImage, colorMode } from '$lib/utils';
	import { ditheredMediaFilesModules } from '$lib/medias';
	import { onMount, onDestroy } from 'svelte';
	import { inview } from 'svelte-inview';
	import * as ExifReader from 'exifreader';

	const options = {};

	type TrailPoint = { x: number; y: number; t: number };
	const trailMap = new WeakMap<HTMLElement, TrailPoint[]>();
	const TRAIL_DURATION = 1000;

	const applyTrailMask = (target: HTMLElement) => {
		const now = performance.now();
		const existing = trailMap.get(target) ?? [];
		const points = existing.filter((p) => now - p.t <= TRAIL_DURATION);

		if (!points.length) {
			trailMap.delete(target);
			target.style.removeProperty('-webkit-mask-image');
			target.style.removeProperty('mask-image');
			return;
		}

		trailMap.set(target, points);

		const gradients = points
			.map((p) => {
				const age = (now - p.t) / TRAIL_DURATION;
				const opacity = Math.max(0, 1 - age);
				const inner = 7;
				const outer = 14;

				return `radial-gradient(
				circle at ${p.x}% ${p.y}%,
				rgba(0,0,0,${opacity}) 0%,
				rgba(0,0,0,${opacity}) ${inner}%,
				rgba(0,0,0,0) ${outer}%,
				rgba(0,0,0,0) 100%
			)`;
			})
			.join(', ');

		target.style.webkitMaskImage = gradients;
		target.style.maskImage = gradients;

		// Keep animating fade-out until all points have expired
		requestAnimationFrame(() => applyTrailMask(target));
	};

	const updateClipFromMouse = (event: MouseEvent | PointerEvent) => {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		const now = performance.now();
		const existing = trailMap.get(target) ?? [];
		existing.push({ x, y, t: now });
		trailMap.set(target, existing);

		applyTrailMask(target);
	};

	const resetClip = (event: PointerEvent) => {
		const target = event.currentTarget as HTMLElement;

		// Let existing points fade naturally; just stop adding new ones.
		// Optionally clear immediately if user leaves for a while.
		setTimeout(() => {
			if (!trailMap.has(target)) return;
			trailMap.delete(target);
			target.style.removeProperty('-webkit-mask-image');
			target.style.removeProperty('mask-image');
		}, TRAIL_DURATION);
	};

	let { data }: PageProps = $props();
	const project = data.project;

	const OrderedProjectMediaFiles = Object.keys(data.projectMediaFiles).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

	const OrderedSubGalleryMediaFiles = Object.keys(data.subGalleryMediaFiles).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

	console.log("Modules", data.mediaFilesModules);

	let thumbnail = findThumbnailImage(data.mediaFilesModules, data.project.tag);

	let isPageLoaded: Boolean = $state(false);

	let videoRefs: HTMLVideoElement[] = $state([]);


	const getCatImage = () => {
		return Promise.resolve(`https://cataas.com/cat?${Math.random()}`);
	};

	async function getExifDataOfSingleFile(src: string) {
		const file = await fetch(src);
		const tag = Object.values(ExifReader.load(await file.arrayBuffer()));
		console.log(tag);
		return tag;
	}

	onMount(() => {
		isPageLoaded = true;
		
	});

	onDestroy(() => {
		videoRefs.forEach((video) => {
			if (video) {
				video.pause();
			}
		});
	});
</script>

<svelte:head>
	<title>{project.title}</title>
	<meta name="description" content={project.description} />
	<meta name="keywords" content={project.description.split(' ').join(', ')} />
	<meta name="author" content={project.author} />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#000000" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={project.title} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.description} />
	<meta property="og:image" content={thumbnail?.src || ''} />
	<meta property="og:site_name" content="Design Team Portfolio" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta
		property="twitter:url"
		content={typeof window !== 'undefined' ? window.location.href : ''}
	/>
	<meta property="twitter:title" content={project.title} />
	<meta property="twitter:description" content={project.description} />
	<meta property="twitter:image" content={thumbnail?.src || ''} />
</svelte:head>

<Header type="project" tag={project.tag} isAbout={false} />
{#key project}
	<section class="main_container">
		<div class="hero_card">
			<!-- <button
				class="hero_backhome sharing_button"
				aria-label="Sharing button"
				onclick={shareHeroCard}
				class:hidden={!isPageLoaded}
				class:transitioned={isPageLoaded}
			>
				<p class="notes">Share this project</p>
			</button> -->
			<div
				class="thumb_cont"
				style="transition-delay: 0.1s;"
				class:hidden={!isPageLoaded}
				class:transitioned={isPageLoaded}
			>
				{#if thumbnail?.src}
					{@const thumbKey = Object.keys(data.mediaFilesModules).find(
						(k) => k.includes(`/${project.tag}/`) && k.toLowerCase().includes('thumb')
					)}
					{@const ditherThumbKey = thumbKey
						? thumbKey.replace('/media/', '/ditheredMedia/').replace(/\.\w+$/, '.png')
						: null}
					{@const ditherThumbFile = ditherThumbKey ? ditheredMediaFilesModules[ditherThumbKey] : null}
					<enhanced:img
						src={thumbnail.src}
						alt={project.title}
						class:grayscaled={$colorMode === 'dark'}
						class="absolute_front"
					/>
					{#if !data.deviceType.isMobile && ditherThumbFile}
						<img
							src={ditherThumbFile.src}
							alt="Project thumbnail dither"
							class="absolute_behind"
							style="z-index: 1;"
							onpointerleave={resetClip}
							onpointerenter={updateClipFromMouse}
							onpointermove={updateClipFromMouse}
						/>
					{/if}
				{:else}
					{#await getCatImage()}
						<p>Loading cat image...</p>
					{:then catImage}
						<enhanced:img
							src={catImage}
							alt={project.title}
							class:grayscaled={$colorMode === 'dark'}
						/>
					{/await}
				{/if}
			</div>
			<div class="hero_text">
				<h1 class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>{project.title}</h1>
				<div class="hero_infos">
					<p
						class="notes"
						class:hidden={!isPageLoaded}
						class:transitioned={isPageLoaded}
						style="transition-delay: 0.2s;"
					>
						Period: {project.year_begin} - {project.year_end}
					</p>
					<p
						class="notes"
						class:hidden={!isPageLoaded}
						class:transitioned={isPageLoaded}
						style="transition-delay: 0.2s;"
					>
						Team: {project.team_people}
					</p>
				</div>
			</div>
			<hr
				class="divider"
				class:hidden={!isPageLoaded}
				class:transitioned={isPageLoaded}
				style="transition-delay: 0.35s;"
			/>
			<div class="context_container">
				<!-- <p
					class="medium"
					class:hidden={!isPageLoaded}
					class:transitioned={isPageLoaded}
					style="transition-delay: 0.35s;"
				>
					Context
				</p> -->
				<p
					id="description"
					class:hidden={!isPageLoaded}
					class:transitioned={isPageLoaded}
					style="transition-delay: 0.35s;"
				>
					{project.description}
				</p>
			</div>
		</div>

		<article class="article_container">
			{#each OrderedProjectMediaFiles as key, index}
				{@const mediaFile = data.projectMediaFiles[key]}
				{#if key.toLowerCase().endsWith('.mp4') || key.toLowerCase().endsWith('.mov')}
					{@const video = videoRefs[index]}
					<div class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
						<video
							src={mediaFile.default}
							use:inview={options}
							oninview_enter={() => {
								if (!video) return;
								video.play();
							}}
							oninview_leave={() => {
								if (!video) return;
								video.pause();
							}}
							preload="metadata"
							muted
							bind:this={videoRefs[index] as HTMLVideoElement}
							controls={false}
							autoplay={true}
							playsinline={true}
							loop={true}
							class:grayscaled={$colorMode === 'dark'}
						>
						</video>
					</div>
				{:else if key.endsWith('.pdf')}
					{#if mediaFile.default}
						<div class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
							<PdfWrapper
								mediafile={mediaFile}
								scale={0.7}
								twoPage={data.deviceType.isMobile ? false : true}
							/>
						</div>
					{/if}
				{:else if !key.toLowerCase().includes('thumb')}
					<div
						class={mediaFile.width > mediaFile.height ? 'horizontal-image' : 'vertical-image'}
						class:hidden={!isPageLoaded}
						class:transitioned={isPageLoaded}
						role="img"
						aria-label="Project media"
					>
						<enhanced:img
							class:grayscaled={$colorMode === 'dark'}
							style="transition-delay: 0.4s;"
							src={mediaFile.src}
							alt="Project media"
						/>
						<div class="exif_data">
							{#await getExifDataOfSingleFile(mediaFile.src)}
								{:then exifData}
									<p>{exifData}</p>
								{:catch error}
									<p>Error: {error}</p>
								{/await}
						</div>
					</div>
				{/if}
			{/each}
			{#if OrderedSubGalleryMediaFiles.length > 0}
				<div class="mosaic">
					{#each OrderedSubGalleryMediaFiles as m}
						{@const mediaFile = data.subGalleryMediaFiles[m]}
						
							<enhanced:img src={mediaFile.src} alt="Sub gallery image" />
							
					{/each}
				</div>
			{/if}
		</article>
		<Footer />
	</section>
{/key}

<style>
	h1 {
		font-size: 32px;
		line-height: 1.1;
	}

	.absolute_behind {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Default: fully hidden; JS adds visible radial masks on hover */
		-webkit-mask-image: radial-gradient(
			circle at 50% 50%,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0) 100%
		);
		mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
	}

	.absolute_front {
		position: relative;
	}

	.main_container {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		min-height: 100vh;
		column-gap: var(--spacing-m);
	}

	.hero_card {
		display: flex;
		position: sticky;
		top: var(--spacing-xxl);
		flex-direction: column;
		row-gap: var(--spacing-m);
		width: 40%;
		height: fit-content;
		margin-left: var(--spacing-l);
		padding: var(--spacing-s);
		background-color: var(--permanent-white);
		transition: all 1.3s var(--curve);
		overflow: visible;
	}

	.exif_data {
		position: absolute;
		bottom: 0;
		left: 0;
		width: fit-content;
		height: 20px;
		background-color: var(--permanent-white);
		color: var(--permanent-black);
		font-size: 12px;
		z-index: 10;
	}

	.context_container {
		overflow: hidden;
		transition: all 0.5s var(--curve);
		transition-delay: 0.1s;
		display: flex;
		flex-direction: column;
		row-gap: var(--spacing-xs);
	}

	#description {
		line-clamp: 10;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	p,
	h1 {
		color: var(--permanent-black);
	}

	.hero_backhome {
		width: 20%;
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		left: var(--spacing-s);
		top: var(--spacing-s);
		z-index: 2;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
		font: inherit;
		transition: opacity 0.1s var(--curve);
	}

	

	.hero_backhome:hover {
		opacity: 0.9;
		transition: opacity 0.1s var(--curve);
	}

	.hero_text {
		display: flex;
		flex-direction: column;
		row-gap: var(--spacing-s);
		width: 100%;
		height: fit-content;
	}

	.hero_text > h1 {
		width: 90%;
	}

	.hero_infos {
		display: flex;
		flex-direction: column;
		row-gap: 0px;
		width: 100%;
		height: fit-content;
	}

	.thumb_cont {
		display: block;
		width: 100%;
		height: 30%;
		aspect-ratio: 21/9;
		overflow: hidden;
		place-content: center;
		position: relative;
	}

	:global(.thumb_cont > img),
	:global(.thumb_cont > picture) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb_cont .absolute_front {
		position: relative;
		z-index: 0;
	}

	.thumb_cont .absolute_behind {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-mask-image: radial-gradient(
			circle at 50% 50%,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0) 100%
		);
		mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: var(--permanent-black);
		grid-column: span 2;
	}

	.article_container {
		display: grid;
		grid-row-gap: var(--spacing-m);
		width: 60%;
		min-height: calc(100vh - 110px);
		height: fit-content;
		grid-template-columns: repeat(2, 1fr);
		grid-column-gap: var(--spacing-m);
		/* Keep the article content (including the PDF viewer) in the normal stacking order
		   so it can receive pointer events correctly. */
		position: relative;
		z-index: 0;
		background-color: var(--color-background);
		padding-bottom: var(--spacing-xl);
		padding-right: var(--spacing-l);
		padding-top: var(--spacing-xxl);
	}

	.article_container > div {
		display: flex;
		flex-direction: column;
		row-gap: var(--spacing-s);
		width: 100%;
		height: fit-content;
		grid-column: span 2;
	}

	.mosaic {
		display: grid !important;
		grid-template-columns: repeat(3, 1fr);
		grid-column-gap: var(--spacing-s);
		grid-row-gap: var(--spacing-s);
		grid-auto-flow: dense;
	}

	:global(.mosaic > img), :global(.mosaic > picture) {
		grid-column: span 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		overflow: hidden;
		background-color: var(--primary-white);
		transition: filter 0.3s var(--curve);
	}

	.horizontal-image {
		grid-column: span 2 !important;
		position: relative;
		overflow: hidden;
	}

	.vertical-image {
		grid-column: span 1 !important;
		position: relative;
		overflow: hidden;
	}

	.horizontal-image img,
	.vertical-image img {
		width: 100%;
		height: auto;
		object-fit: cover;
		overflow: hidden;
		background-color: var(--primary-white);
		transition: filter 0.3s var(--curve);
	}

	.grayscaled {
		filter: grayscale(1);
		transition: filter 0.3s var(--curve);
	}

	#description {
		padding-right: var(--spacing-xs);
	}

	@media (max-width: 768px) {
		.main_container {
			display: flex;
			flex-direction: column;
			row-gap: var(--spacing-m);
			width: 100%;
			height: 100%;
			padding: var(--spacing-m);
			margin-top: var(--spacing-m);
		}

		.thumb_cont {
			display: block;
			aspect-ratio: 31/9;
			width: 100%;
			margin-top: var(--spacing-xl);
		}

		.hero_text {
			width: 100%;
			position: relative;
			padding: 0px;
		}

		.hero_text > h1 {
			width: 90%;
			overflow: visible;
			color: var(--primary-black);
		}

		.article_container {
			padding: 0px;
			display: flex;
			flex-direction: column;
			row-gap: var(--spacing-s);
			width: 100%;
		}

		#description {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 15;
			line-clamp: 15;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 0px;
			padding-right: 0px;
		}

		.hero_card {
			position: static;
			top: unset;
			width: 100%;
			margin-left: 0px;
			padding: 0px;
			background-color: transparent;
			transform: translateY(0%);
		}

		.hero_text {
			row-gap: var(--spacing-m);
		}

		.hero_backhome {
			display: none;
		}

		p {
			color: var(--primary-black);
		}

		.mosaic {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
