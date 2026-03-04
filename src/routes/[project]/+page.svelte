<script lang="ts">
	import type { PageProps } from './$types';
	import PdfWrapper from '$lib/components/pdf_wrapper.svelte';

	import { colorMode } from '$lib/utils';
	import { SITE_NAME, DEFAULT_OG_IMAGE, buildCanonicalUrl, toAbsoluteUrl } from '$lib/seo';
	import type { ImageMetadata, TrailPoint, YamlTextModule } from '$lib/types';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { inview } from 'svelte-inview';
	import { load as yamlLoad } from 'js-yaml';

	const options = {};
	const isImageMetadata = (value: unknown): value is ImageMetadata => {
		return (
			typeof value === 'object' &&
			value !== null &&
			'src' in value &&
			'width' in value &&
			'height' in value
		);
	};

	const trailMap = new WeakMap<HTMLElement, TrailPoint[]>();
	const TRAIL_DURATION = 1000;
	const hasPointerEvents = () =>
		typeof window !== 'undefined' && typeof window.PointerEvent !== 'undefined';

	const eventPoint = (event: PointerEvent | MouseEvent | TouchEvent) => {
		if ('touches' in event || 'changedTouches' in event) {
			const touchEvent = event as TouchEvent;
			const touch = touchEvent.touches?.[0] ?? touchEvent.changedTouches?.[0];
			if (!touch) return null;
			return { x: touch.clientX, y: touch.clientY };
		}

		return { x: event.clientX, y: event.clientY };
	};

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

	const updateClipFromInput = (event: PointerEvent | MouseEvent | TouchEvent) => {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		const point = eventPoint(event);
		if (!point) return;

		const rect = target.getBoundingClientRect();

		const x = ((point.x - rect.left) / rect.width) * 100;
		const y = ((point.y - rect.top) / rect.height) * 100;

		const now = performance.now();
		const existing = trailMap.get(target) ?? [];
		existing.push({ x, y, t: now });
		trailMap.set(target, existing);

		applyTrailMask(target);
	};

	const resetClip = (event: PointerEvent | MouseEvent | TouchEvent) => {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		// Let existing points fade naturally; just stop adding new ones.
		// Optionally clear immediately if user leaves for a while.
		setTimeout(() => {
			if (!trailMap.has(target)) return;
			trailMap.delete(target);
			target.style.removeProperty('-webkit-mask-image');
			target.style.removeProperty('mask-image');
		}, TRAIL_DURATION);
	};

	const handlePointerEnter = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handlePointerLeave = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		resetClip(event);
	};

	const handleMouseEnter = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleMouseLeave = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		resetClip(event);
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		resetClip(event);
	};

	const findDidascalia = async (filePath: string): Promise<string | null> => {
		const filename = filePath.split('.').shift();

		if (!filename) {
			return null;
		}

		const didascaliaKey = Object.keys(data.didascaliaEntries).find((d) => d.includes(filename));

		if (!didascaliaKey) {
			return null;
		}

		const rawYamlContent = data.didascaliaEntries[didascaliaKey] as YamlTextModule;

		if (!rawYamlContent.default?.length) {
			return null;
		}

		try {
			const finalText = yamlLoad(rawYamlContent.default) as { imgDescription?: string };
			return typeof finalText.imgDescription === 'string' ? finalText.imgDescription : null;
		} catch {
			return null;
		}
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
			class="sticky top-40 ml-10 flex h-fit w-2/5 flex-col gap-5 overflow-visible bg-[var(--permanent-white)] p-2.5 text-[var(--permanent-black)] transition-all duration-[1300ms] [transition-timing-function:var(--curve)] max-md:static max-md:top-auto max-md:ml-0 max-md:w-full max-md:bg-transparent max-md:p-0 max-md:translate-y-0"
		>
			<!-- <button
					class="hero_backhome sharing_button"
					aria-label="Sharing button"
					onclick={shareHeroCard}
				>
					<p class="notes">Share this project</p>
				</button> -->
			<div
				class="relative grid h-[30%] w-full place-content-center overflow-hidden aspect-21/9 max-md:mt-20 max-md:aspect-[31/9]"
				style="transition-delay: 0.1s;"
				in:fly={{ y: 20, duration: 700, delay: 100 }}
			>
				{#if data.thumbnailSrc}
					<enhanced:img
						src={data.thumbnailSrc}
						alt={project.title}
						class="relative z-0 h-full w-full object-cover transition-[filter] duration-300 [transition-timing-function:var(--curve)]"
						class:grayscale={$colorMode === 'dark'}
					/>
					{#if !data.deviceType.isMobile && data.ditherThumbnailSrc}
						<img
							src={data.ditherThumbnailSrc}
							alt="Project thumbnail dither"
							class="absolute inset-0 z-[1] h-full w-full object-cover [-webkit-mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)] [mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_100%)]"
							onpointerleave={handlePointerLeave}
							onpointerenter={handlePointerEnter}
							onpointermove={handlePointerMove}
							onmouseleave={handleMouseLeave}
							onmouseenter={handleMouseEnter}
							onmousemove={handleMouseMove}
							ontouchstart={handleTouchStart}
							ontouchmove={handleTouchMove}
							ontouchend={handleTouchEnd}
						/>
					{/if}
				{/if}
			</div>
			<div class="flex h-fit w-full flex-col gap-2.5 max-md:relative max-md:w-full max-md:gap-5">
				<h1
					class="w-[90%] text-[32px] leading-[1.1] text-[var(--permanent-black)] max-md:text-primary"
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
				class="h-px w-full bg-[var(--permanent-black)]"
				in:fly={{ y: 20, duration: 700, delay: 350 }}
				style="transition-delay: 0.35s;"
			/>
			<div
				class="flex flex-col gap-[5px] overflow-hidden transition-all duration-500 [transition-delay:0.1s] [transition-timing-function:var(--curve)]"
			>
				<!-- <p
						class="medium"
						style="transition-delay: 0.35s;"
					>
						Context
				</p> -->
				<p
					id="description"
					class="pr-[5px] [display:-webkit-box] overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:10] [line-clamp:10] max-md:pr-0 max-md:[-webkit-line-clamp:15] max-md:[line-clamp:15]"
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
							class="h-auto w-full transition-[filter] duration-300 [transition-timing-function:var(--curve)]"
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
								twoPage={data.deviceType.isMobile ? false : true}
							/>
						</div>
					{/if}
				{:else if !key.toLowerCase().includes('thumb') && key && isImageMetadata(mediaFile)}
					{@const filePath = key.split('/').pop()}
					<div
						class={`${mediaFile.width > mediaFile.height ? 'col-span-2' : 'col-span-1'} relative overflow-hidden`}
						in:fly={{ y: 16, duration: 550 }}
						role="img"
						aria-label="Project media"
					>
						<enhanced:img
							class="h-auto w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:var(--curve)]"
							class:grayscale={$colorMode === 'dark'}
							style="transition-delay: 0.4s;"
							src={mediaFile.src}
							alt="Project media"
						/>
						{#if filePath}
							{#await findDidascalia(filePath) then d}
								{#if d}
									<div
										class="absolute bottom-0 left-0 z-10 h-5 w-fit bg-[var(--permanent-white)] px-[5px] text-[12px] text-[var(--permanent-black)]"
									>
										<p class="notes">{d}</p>
									</div>
								{/if}
							{/await}
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
							class="col-span-1 h-full w-full overflow-hidden bg-inverse object-cover transition-[filter] duration-300 [transition-timing-function:var(--curve)]"
						/>
					{/each}
				</div>
			{/if}
		</article>
	</section>
{/key}
