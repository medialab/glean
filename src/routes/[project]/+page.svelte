<script lang="ts">
	import type { PageProps } from './$types';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import PdfWrapper from '$lib/components/pdf_wrapper.svelte';

	import { findThumbnailImage, colorMode } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';
	import { toBlob } from 'html-to-image';
	import { inview } from 'svelte-inview';
	// `resolve` is only for route paths; not needed for media URLs here.

	const options = {};

	let { data }: PageProps = $props();
	const project = data.project;

	const projectMediaFiles = data.projectMediaFiles;

	let thumbnail = findThumbnailImage(data.mediaFilesModules, data.project.tag);
	console.log('thumbnail', thumbnail);

	let isPageLoaded: Boolean = $state(false);

	let videoRefs: HTMLVideoElement[] = $state([]);
	let heroCardElement: HTMLDivElement = $state()!;

	const shareHeroCard = async () => {
		if (!heroCardElement) {
			console.error('Hero card element not found');
			return;
		}

		try {
			// Convert the hero_card element to a blob
			const blob = await toBlob(heroCardElement, {
				cacheBust: true,
				pixelRatio: 2 // Higher quality export
			});

			if (!blob) {
				console.error('Failed to generate image from hero card');
				return;
			}

			// Check if navigator.share is available
			if (navigator.share && navigator.canShare) {
				const file = new File([blob], `${project.tag}-project.png`, {
					type: 'image/png'
				});

				const shareData = {
					files: [file],
					title: project.title,
					text: `Check out this project: ${project.title}`
				};

				if (navigator.canShare(shareData)) {
					await navigator.share(shareData);
				} else {
					// Fallback: download the image
					downloadImage(blob);
				}
			} else {
				// Fallback: download the image
				downloadImage(blob);
			}
		} catch (error) {
			console.error('Error sharing hero card:', error);
			navigator.clipboard.writeText(window.location.href);
		}
	};

	const downloadImage = (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${project.tag}-project.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const getCatImage = () => {
		return Promise.resolve(`https://cataas.com/cat?${Math.random()}`);
	};

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

<Header type="project" tag={project.tag} isAbout={false} />
{#key project}
	<section class="main_container">
		<div class="hero_card" bind:this={heroCardElement}>
			<button
				class="hero_backhome sharing_button"
				aria-label="Sharing button"
				onclick={shareHeroCard}
				class:hidden={!isPageLoaded}
				class:transitioned={isPageLoaded}
			>
				<p class="notes">Share this project</p>
			</button>
			<div
				class="thumb_cont"
				style="transition-delay: 0.1s;"
				class:hidden={!isPageLoaded}
				class:transitioned={isPageLoaded}
			>
				{#if thumbnail?.src}
					<img src={thumbnail.src} alt={project.title} class:grayscaled={$colorMode === 'dark'} />
				{:else}
					{#await getCatImage()}
						<p>Loading cat image...</p>
					{:then catImage}
						<img src={catImage} alt={project.title} class:grayscaled={$colorMode === 'dark'} />
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
						{project.project_type} | {project.year_begin} - {project.year_end}
					</p>
					<p
						class="notes"
						class:hidden={!isPageLoaded}
						class:transitioned={isPageLoaded}
						style="transition-delay: 0.2s;"
					>
						Inquiry lead: {project.team_people}
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
				<p
					class="medium"
					class:hidden={!isPageLoaded}
					class:transitioned={isPageLoaded}
					style="transition-delay: 0.35s;"
				>
					Context
				</p>
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
			{#each Object.entries(projectMediaFiles) as [key, mediaFile], index}
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
					>
						<img
							class:grayscaled={$colorMode === 'dark'}
							style="transition-delay: 0.4s;"
							src={mediaFile.src}
							alt="Project media"
							width={mediaFile.width}
							height={mediaFile.height}
						/>
					</div>
				{/if}
			{/each}
		</article>
		<Footer />
	</section>
{/key}

<style>
	h1 {
		font-size: 32px;
		line-height: 1.1;
	}

	.main_container {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		min-height: 100vh;
		padding-top: 110px;
		column-gap: var(--spacing-m);
	}

	.hero_card {
		display: flex;
		position: sticky;
		top: 46%;
		transform: translateY(-47%);
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

	.context_container {
		overflow: hidden;
		transition: all 0.5s var(--curve);
		transition-delay: 100ms;
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

	.sharing_button {
		background-color: var(--permanent-white);
		padding: var(--spacing-xs);
		margin: 0px;
		width: fit-content;
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
	}

	.thumb_cont > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
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
		z-index: -1;
		background-color: var(--color-background);
		padding-bottom: var(--spacing-xl);
		padding-right: var(--spacing-l);
	}

	.article_container > div {
		display: flex;
		flex-direction: column;
		row-gap: var(--spacing-s);
		width: 100%;
		height: fit-content;
		grid-column: span 2;
	}

	.horizontal-image {
		grid-column: span 2 !important;
	}

	.vertical-image {
		grid-column: span 1 !important;
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
	}
</style>
