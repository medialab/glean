<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { colorMode } from '$lib/stores/color-mode';
	import { deviceType } from '$lib/stores/device-type';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	onMount(() => {
		const width = window.innerWidth;
		deviceType.set({
			isMobile: width < 768,
			isTablet: width >= 768 && width < 1024,
			isDesktop: width >= 1024
		});
	});

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

<Header />

{@render children?.()}

<Footer />
