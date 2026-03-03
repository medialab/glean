<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { colorMode } from '$lib/utils';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
	const headerType = $derived(page.route.id === '/' ? 'home' : 'project');

	$effect(() => {
		if ($colorMode === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header type={headerType} isAbout={false} />

{@render children?.()}

<Footer />

<style>
	:global(body) {
		background-color: var(--color-background);
		-webkit-overflow-scrolling: touch;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	:global(svg) {
		fill: var(--primary-black);
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
		letter-spacing: -0.03em;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
	}

	:global(:root) {
		--spacing-xs: 5px;
		--spacing-s: 10px;
		--spacing-m: 20px;
		--spacing-l: 40px;
		--spacing-xl: 80px;
		--spacing-xxl: 160px;

		--curve: cubic-bezier(0.65, 0.12, 0.62, 0.96);
		--permanent-black: #1f1f1f;
		--permanent-white: #ffffff;
	}

	:global([data-theme='light']) {
		--color-background: #f9f9f9; /*For bg*/
		--color-surface: #ffffff; /* For info container and things that are currently purely white */

		--primary-black: #000000; /* For text and other things that are currently purely black */
		--secondary-dark: #afafaf; /* For text calss notes */
		--primary-white: #ffffff;
	}

	:global([data-theme='dark']) {
		/* Light mode colors (default) */
		--color-background: #101010; /*For bg*/
		--color-surface: #141414; /* For info container and things that are currently purely white */

		--primary-black: #ffffff; /* For text and other things that are currently purely black */
		--secondary-dark: #c0c0c0; /* For text calss notes */
		--primary-white: #000;
	}

	:global(::selection) {
		background-color: var(--primary-black);
		color: var(--primary-white);
	}

	:global(h1) {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--primary-black);
	}

	:global(h2) {
		font-size: 22px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--primary-black);
	}

	:global(.notes) {
		font-size: 12px;
		color: var(--secondary-dark);
	}

	:global(p) {
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		color: var(--primary-black);
	}

	:global(.medium) {
		font-size: 18px;
		font-weight: 500;
		line-height: 1.3;
	}

	:global(button, a) {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
	}

	:global(
		a:focus-visible,
		button:focus-visible,
		[role='button']:focus-visible,
		[tabindex]:focus-visible
	) {
		outline: 2px solid var(--permanent-black);
		outline-offset: 2px;
		box-shadow: 0 0 0 2px var(--permanent-white);
	}

	:global(button:hover, a:hover, .navigator_container:hover) {
		filter: invert(100%) !important;
	}

	:global(::-webkit-scrollbar) {
		width: 20px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--color-background);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--color-surface);
		border-radius: 1px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--color-surface);
	}

	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: var(--color-surface) var(--color-background);
	}

	:global(.hidden) {
		transform: translateY(+10%);
		opacity: 0;
		clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%);
		transition:
			transform 1s var(--curve),
			opacity 1s var(--curve),
			clip-path 1s var(--curve),
			filter 1s var(--curve);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		-webkit-transform: translateY(10%) translateZ(0);
		will-change: transform, opacity, clip-path;
		filter: blur(2px);
	}

	:global(.transitioned) {
		transform: translateY(0%);
		opacity: 1;
		clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 0);
		transition:
			transform 1s var(--curve),
			opacity 1s var(--curve),
			clip-path 1s var(--curve),
			filter 1s var(--curve);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		-webkit-transform: translateY(0) translateZ(0);
		will-change: transform, opacity, clip-path;
		filter: blur(0px);
	}

	:global(.hover_container > svg) {
		width: 30px;
		height: 30px;
	}

	@media (max-width: 768px) {
		:global(h1) {
			font-size: 36px;
			font-weight: 500;
			word-spacing: -0.08em;
		}

		:global(h2) {
			font-size: 16px;
			font-weight: 300;
			word-spacing: -0.08em;
		}

		:global(body) {
			display: flex;
			flex-direction: column;
		}

		:global(.hover_container > svg) {
			width: 25px;
			height: 25px;
		}
	}
</style>
