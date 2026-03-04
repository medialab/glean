<script lang="ts">
	import { colorMode } from '$lib/utils';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let isPageLoaded = $state(false);

	onMount(() => {
		isPageLoaded = true;
	});
</script>

{#snippet logo_container()}
	<a
		class="w-max hidden md:flex flex-col items-center justify-center"
		href={resolve('/')}
		id="logo_container"
	>
		<p class="notes bg-white px-1">medialab Sciences Po</p>
		<h1 class="bg-white px-1">Collective Inquiries and Inventive Formats group</h1>
	</a>
{/snippet}

{#snippet colorswitch_container()}
	<div class="hover_container">
		<div class="md:flex gap-1 hidden">
			<button
				onclick={() => colorMode.set('light')}
				class="bg-white px-1"
				style="opacity:{$colorMode === 'light' ? '1' : '1'}; pointer-events:{$colorMode === 'light'
					? 'none'
					: 'auto'}"
			>
				<p>Light</p>
			</button>
			<p>/</p>
			<button
				onclick={() => colorMode.set('dark')}
				class="bg-white px-1"
				style="opacity:{$colorMode === 'dark' ? '1' : '0.5'}; pointer-events:{$colorMode === 'dark'
					? 'none'
					: 'auto'}"
			>
				<p>Dark</p>
			</button>
		</div>

		<div class="md:hidden flex">
			{#if $colorMode === 'light'}
				<button onclick={() => colorMode.set('dark')} aria-label="Switch to dark mode">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-7 h-7"
						><path
							d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"
						/></svg
					>
				</button>
			{:else}
				<button onclick={() => colorMode.set('light')} aria-label="Switch to light mode">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-7 h-7"
						><path
							d="M380-160q133 0 226.5-93.5T700-480q0-133-93.5-226.5T380-800h-21q-10 0-19 2 57 66 88.5 147.5T460-480q0 89-31.5 170.5T340-162q9 2 19 2h21Zm0 80q-53 0-103.5-13.5T180-134q93-54 146.5-146T380-480q0-108-53.5-200T180-826q46-27 96.5-40.5T380-880q83 0 156 31.5T663-763q54 54 85.5 127T780-480q0 83-31.5 156T663-197q-54 54-127 85.5T380-80Zm80-400Z"
						/></svg
					>
				</button>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet navigator_container()}
	{#if page.url.pathname === '/'}
		<div class="navigator_container">
			<div class="md:flex hidden">
				<a href={resolve('/about')} class="bg-white px-1">
					<p>Info</p>
				</a>
			</div>

			<div class="block md:hidden" id="info_icon">
				<a href={resolve('/about')} aria-label="Navigate to about page">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-7 h-7"
						><path
							d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
						/></svg
					>
				</a>
			</div>
		</div>
	{:else}
		<div class="navigator_container">
			<a
				class="hover_container"
				href={resolve('/')}
				id="backhome"
				data-sveltekit-preload-data
				aria-label="Back to home"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -720 700 800" class="w-7 h-7"
					><path
						d="M600-160v-360H272l64 64-56 56-160-160 160-160 56 56-64 64h328q33 0 56.5 23.5T680-520v360h-80Z"
					/>
				</svg>
			</a>
		</div>
	{/if}
{/snippet}

<header id="home_header">
	{@render navigator_container()}
	{@render logo_container()}
	{@render colorswitch_container()}
</header>
