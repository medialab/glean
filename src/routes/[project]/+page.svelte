<script lang="ts">
	import type { PageProps } from './$types';
	import PdfWrapper from '$lib/components/pdf_wrapper.svelte';

	import { colorMode } from '$lib/stores/color-mode';
	import { deviceType } from '$lib/stores/device-type';
	import { SITE_NAME, DEFAULT_OG_IMAGE, buildCanonicalUrl, toAbsoluteUrl } from '$lib/seo';
	import { isImageMetadata } from '$lib/media/guards';
	import { createPointerTrailMask } from '$lib/ui/pointer-trail';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	const options = {};
	const pointerTrail = createPointerTrailMask(1000);

	const stemFromFilePath = (filePath: string): string | null => {
		const baseName = filePath.split('/').pop();
		if (!baseName) return null;
		const stem = baseName.replace(/\.[^.]+$/, '');
		return stem || null;
	};

	const didascaliaFromFilePath = (filePath: string | undefined): string | null => {
		if (!filePath) return null;
		const stem = stemFromFilePath(filePath);
		if (!stem) return null;
		return data.didascaliaByStem?.[stem] ?? null;
	};

	let { data }: PageProps = $props();

	const project = data.project;

	const orderedProjectMediaFiles = Object.keys(data.projectMediaFiles).sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true })
	);

	const orderedSubGalleryMediaFiles = Object.keys(data.subGalleryMediaFiles).sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true })
	);

	const pageTitle = `${project.title} | ${SITE_NAME}`;
	const pageDescription = project.description;
	const pageUrl = buildCanonicalUrl(`/${encodeURIComponent(project.tag)}`);
	const pageImage = data.thumbnailSrc ? toAbsoluteUrl(data.thumbnailSrc) : DEFAULT_OG_IMAGE;

	let videoRefs: HTMLVideoElement[] = $state([]);

	onDestroy(() => {
		videoRefs.forEach((video) => {
			if (video) {
				video.pause();
			}
		});
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
	<meta property="og:image:alt" content={`${project.title} preview`} />

	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content={`${project.title} preview`} />

	<meta name="keywords" content={project.description.split(' ').join(', ')} />
	<meta name="author" content={project.author} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#000000" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={pageTitle} />
</svelte:head>
{#key project}
	<section
		class="relative flex min-h-screen w-full flex-row gap-5 max-md:mt-5 max-md:h-full max-md:w-full max-md:flex-col max-md:gap-5 max-md:p-5"
	>
		<div
			class="sticky top-40 ml-10 flex h-fit w-2/5 flex-col gap-5 overflow-visible bg-(--permanent-white) p-2.5 text-(--permanent-black) transition-all duration-1300 [transition-timing-function:--curve] max-md:static max-md:top-auto max-md:ml-0 max-md:w-full max-md:bg-transparent max-md:p-0 max-md:translate-y-0"
		>
			<!-- <button
					class="hero_backhome sharing_button"
					aria-label="Sharing button"
					onclick={shareHeroCard}
				>
					<p class="notes">Share this project</p>
				</button> -->
			<div
				class="relative grid h-[30%] w-full place-content-center overflow-hidden aspect-21/9 max-md:mt-20 max-md:aspect-31/9"
				style="transition-delay: 0.1s;"
				in:fly={{ y: 20, duration: 700, delay: 100 }}
			>
				{#if data.thumbnailSrc}
					<enhanced:img
						src={data.thumbnailSrc}
						alt={project.title}
						class="relative z-0 h-full w-full object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
						class:grayscale={$colorMode === 'dark'}
					/>
					{#if !$deviceType.isMobile && data.ditherThumbnailSrc}
						<img
							src={data.ditherThumbnailSrc}
							alt="Project thumbnail dither"
							class="absolute inset-0 z-[1] h-full w-full object-cover [-webkit-mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)] [mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)]"
							onpointerleave={pointerTrail.handlePointerLeave}
							onpointerenter={pointerTrail.handlePointerEnter}
							onpointermove={pointerTrail.handlePointerMove}
							onmouseleave={pointerTrail.handleMouseLeave}
							onmouseenter={pointerTrail.handleMouseEnter}
							onmousemove={pointerTrail.handleMouseMove}
							ontouchstart={pointerTrail.handleTouchStart}
							ontouchmove={pointerTrail.handleTouchMove}
							ontouchend={pointerTrail.handleTouchEnd}
						/>
					{/if}
				{/if}
			</div>
			<div class="flex h-fit w-full flex-col gap-2.5 max-md:relative max-md:w-full max-md:gap-5">
				<h1
					class="w-[90%] text-[32px] leading-[1.1] text-(--permanent-black) max-md:text-primary"
					in:fly={{ y: 20, duration: 700, delay: 130 }}
				>
					{project.title}
				</h1>
				<div class="flex h-fit w-full flex-col gap-0">
					<p
						class="notes"
						in:fly={{ y: 20, duration: 700, delay: 200 }}
						style="transition-delay: 0.2s;"
					>
						Period: {project.year_begin} - {project.year_end}
					</p>
					<p
						class="notes"
						in:fly={{ y: 20, duration: 700, delay: 240 }}
						style="transition-delay: 0.2s;"
					>
						Team: {project.team_people}
					</p>
				</div>
			</div>
			<hr
				class="h-px w-full bg-(--permanent-black)"
				in:fly={{ y: 20, duration: 700, delay: 350 }}
				style="transition-delay: 0.35s;"
			/>
			<div
				class="flex flex-col gap-1.25 overflow-hidden transition-all duration-500 delay-100 [transition-timing-function:--curve]"
			>
				<!-- <p
						class="medium"
						style="transition-delay: 0.35s;"
					>
						Context
				</p> -->
				<p
					id="description"
					class="pr-1.25 [display:-webkit-box] overflow-hidden text-ellipsis [-webkit-box-orient:vertical] -webkit-line-clamp-10 line-clamp-10 max-md:pr-0 max-md:-webkit-line-clamp-15 max-md:line-clamp-15 text-(--permanent-black)"
					in:fly={{ y: 20, duration: 700, delay: 380 }}
					style="transition-delay: 0.35s;"
				>
					{project.description}
				</p>
			</div>
		</div>

		<article
			class="relative z-0 grid h-fit min-h-[calc(100vh-110px)] w-3/5 grid-cols-2 gap-x-5 gap-y-5 bg-background pt-40 pr-10 pb-20 max-md:flex max-md:w-full max-md:flex-col max-md:gap-2.5 max-md:p-0"
		>
			{#each orderedProjectMediaFiles as key, index}
				{@const mediaFile = data.projectMediaFiles[key]}
				{#if key.toLowerCase().endsWith('.mp4') || key.toLowerCase().endsWith('.mov')}
					{@const video = videoRefs[index]}
					<div
						class="col-span-2 flex h-fit w-full flex-col gap-2.5"
						in:fly={{ y: 16, duration: 550 }}
					>
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
							class="h-auto w-full transition-[filter] duration-300 [transition-timing-function:--curve]"
							class:grayscale={$colorMode === 'dark'}
						>
						</video>
					</div>
				{:else if key.endsWith('.pdf')}
					{#if mediaFile.default}
						<div
							class="col-span-2 flex h-fit w-full flex-col gap-2.5"
							in:fly={{ y: 16, duration: 550 }}
						>
							<PdfWrapper
								mediafile={mediaFile}
								scale={0.7}
								twoPage={$deviceType.isMobile ? false : true}
							/>
						</div>
					{/if}
				{:else if !key.toLowerCase().includes('thumb') && key && isImageMetadata(mediaFile)}
					{@const filePath = key.split('/').pop()}
					{@const didascalia = didascaliaFromFilePath(filePath)}
					<div
						class={`${mediaFile.width > mediaFile.height ? 'col-span-2' : 'col-span-1'} relative overflow-hidden`}
						in:fly={{ y: 16, duration: 550 }}
						role="img"
						aria-label="Project media"
					>
						<enhanced:img
							class="h-auto w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
							class:grayscale={$colorMode === 'dark'}
							style="transition-delay: 0.4s;"
							src={mediaFile.src}
							alt="Project media"
						/>
						{#if didascalia}
							<div
								class="absolute bottom-0 left-0 z-10 h-5 w-fit bg-(--permanent-white) px-1.25 text-[12px] text-(--permanent-black)"
							>
								<p class="notes">{didascalia}</p>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
			{#if orderedSubGalleryMediaFiles.length > 0}
				<div class="grid grid-flow-dense grid-cols-3 gap-2.5 max-md:grid-cols-2">
					{#each orderedSubGalleryMediaFiles as m}
						{@const mediaFile = data.subGalleryMediaFiles[m]}

						<enhanced:img
							src={mediaFile.src}
							alt="Sub gallery media"
							class="col-span-1 h-full w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:--curve]"
						/>
					{/each}
				</div>
			{/if}
		</article>
	</section>
{/key}
