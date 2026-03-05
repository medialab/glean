<script lang="ts">
	import { SITE_NAME, DEFAULT_OG_IMAGE, buildCanonicalUrl } from '$lib/seo';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	const pageTitle = `About | ${SITE_NAME}`;
	const pageDescription =
		'About the Collective Inquiries and Inventive Formats group and its design-led research practice.';
	const pageUrl = buildCanonicalUrl('/about');
	const pageImage = DEFAULT_OG_IMAGE;

	let isPageLoaded = $state(false);

	onMount(() => {
		isPageLoaded = true;
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

<section
	class="mt-40 mb-10 flex flex-col gap-10 px-10 pb-20 max-md:mt-20 max-md:mb-5 max-md:gap-5 max-md:px-5 max-md:pb-0"
>
	<div class="h-max w-full pt-5">
		<p class="text-[64px] leading-[1.15] tracking-[-0.06em] text-secondary max-md:text-[28px]">
			{#if isPageLoaded}
				<span class="font-medium text-primary" transition:fly={{ y: 18, duration: 700, delay: 90 }}
					>This portfolio presents design not as a way to package answers, but as a means to ask
					better questions.
				</span>
				<span transition:fly={{ y: 50, duration: 700, delay: 350 }}
					>It brings together tools and formats—maps, games, exhibitions, fanzines—created to probe
					issues that often elude standard research methods. These objects are not results but
					instruments: epistemic artefacts crafted to generate data, provoke responses, and reveal
					what usually remains unseen, unspoken, and unnoticed. Rather than presenting a
					retrospective, this collection functions as a living archive—more akin to gleaning than to
					displaying—composed of fragments from ongoing inquiries. Each piece demonstrates a
					commitment to documenting and theorising design in both its material specifics and
					conceptual scope, linking tangible gestures to broader ways of knowing. Developed by a
					multidisciplinary team of designers, sociologists, artists, political scientists, and
					semioticians, this work takes place in experimental settings where the distinction between
					observer and participant becomes blurred. Drawing on Science and Technology Studies and
					pragmatist philosophy, we view problems not as static or given, but as relational,
					ever-changing, and shaped by the very methods employed to study them. To describe, in this
					context, is already to intervene. In assembling this portfolio, we propose a model of
					design research that resists closure, embraces complexity, and remains accountable to the
					social worlds it engages with.</span
				>
			{/if}
		</p>
	</div>
	<a
		class="flex w-fit flex-row items-center justify-center gap-2.5 bg-surface px-5 py-2.5 max-md:w-full"
		href="mailto:donato.ricci@sciencespo.fr"
	>
		<h2>Write us an email</h2>
		<svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px"
			><path
				d="m490-527 37 37 217-217-37-37-217 217ZM200-200h37l233-233-37-37-233 233v37Zm355-205L405-555l167-167-29-29-219 219-56-56 218-219q24-24 56.5-24t56.5 24l29 29 50-50q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T828-678L555-405ZM270-120H120v-150l285-285 150 150-285 285Z"
			/></svg
		>
	</a>
</section>
