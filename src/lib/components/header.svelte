<script lang="ts">
	import { colorMode } from '$lib/utils';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let props = $props();
	let isPageLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			isPageLoaded = true;
		}, 10);
	});
</script>

{#snippet logo_container()}
	<a class="logo_container" href={resolve('/')}>
		<!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 25">
			<path
				d="M12.999 0C19.7316 0 25.1894 5.45783 25.1895 12.1904C25.1895 18.9231 19.7317 24.3809 12.999 24.3809C6.26642 24.3808 0.808594 18.9231 0.808594 12.1904C0.808676 5.45788 6.26647 8.19504e-05 12.999 0ZM13.0557 1.00195C6.84562 1.00195 1.81055 6.03703 1.81055 12.2471C1.81077 18.4569 6.84576 23.4912 13.0557 23.4912C19.2654 23.491 24.2996 18.4568 24.2998 12.2471C24.2998 6.03716 19.2655 1.00218 13.0557 1.00195Z"
			/>
			<path
				d="M6.93168 18.5363H4.87208L4.31543 17.0333L5.87405 15.8644L5.3174 14.5284L6.4307 12.0792V10.5206L6.93168 10.0752L6.4307 9.90825L6.76468 9.46294V9.18461L6.37503 9.46294L6.4307 6.06739L6.93168 6.45704L7.04301 6.06739L7.32133 6.45704H8.3233L8.71295 6.79103L8.49029 6.84669V6.95802H9.1026L10.4386 7.51467L10.1046 7.95999H8.43463V9.68559L9.1026 11.4669L9.60359 11.8565L9.77058 9.40727H12.3312L12.8321 9.90825L13.3331 9.40727H15.838L16.0607 11.8565L16.673 11.1885L17.341 9.40727L17.007 8.34964H16.005L15.671 7.40334L17.007 7.06935L17.174 6.62403H17.8976L18.0646 5.84473L19.2893 6.17872L20.0129 6.84669H19.4562L20.0129 7.84866H19.5676L20.0129 8.34964V9.40727L19.4562 8.90629L19.8459 9.68559L18.8996 10.6876L20.4025 14.4728L19.8459 15.9757L21.4045 16.9777V17.256L20.7922 18.5363H19.1779V17.9796H19.7346L20.0129 17.3673L18.3986 16.1984V15.9757L18.7883 14.9737L17.007 12.6915L17.508 11.9122L16.2277 12.6915L16.339 14.0274H13.5558L12.9435 14.6954L12.1085 14.0274H9.49226V12.6915L8.1563 11.9122L8.76861 12.5802L6.93168 14.9737V15.1407L7.32133 16.1984L5.70705 17.3673L5.98538 17.9796L6.93168 18.2023V18.5363Z"
			/>
			<path
				d="M9.38093 15.1964L8.43463 13.9161L7.48833 14.9737V15.1964L7.98931 15.7531V16.0314L7.26567 17.4787V17.757L7.71098 18.5363L9.82625 18.592L9.93757 18.2023L8.71295 17.9796L8.43463 17.7013V17.3673L9.38093 15.5304V15.1964Z"
			/>
			<path
				d="M18.1203 14.9737L17.341 13.9161L16.339 15.1964V15.4747L17.341 17.59L17.2297 17.8683H16.2277V18.5363H18.009L18.4543 17.6457V17.3673L17.7863 15.9757V15.7531L18.1203 15.3077V14.9737Z"
			/>
			<path
				d="M4.31543 7.51467L3.92578 9.29594L4.3711 9.35161L4.31543 12.5802H4.87208L5.20607 13.9161L5.92971 11.9678L5.87405 9.18461L4.31543 7.51467Z"
			/>
			<path
				d="M22.1838 10.0752V11.5225L21.1819 10.0196H20.9592L20.1799 10.8546V11.1885L20.9592 12.8585V13.2481L20.6252 13.9161H20.5139L19.4562 10.8546V10.6876L21.4045 8.62796H21.5158L22.1838 10.0752Z"
			/>
		</svg>-->
		<p class="notes">medialab Sciences Po</p>
		<h1>Collective Inquiries and Inventive Formats group</h1>
	</a>
{/snippet}

{#snippet colorswitch_container()}
	<div class="hover_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
		<!--<p class="notes">Switch reading mode</p>-->

		<div class="navigator_links">
			<button
				onclick={() => colorMode.set('light')}
				style="opacity:{$colorMode === 'light' ? '1' : '0.5'}; pointer-events:{$colorMode ===
				'light'
					? 'none'
					: 'auto'}"
			>
				<p>Light</p>
			</button>
			<p>/</p>
			<button
				onclick={() => colorMode.set('dark')}
				style="opacity:{$colorMode === 'dark' ? '1' : '0.5'}; pointer-events:{$colorMode === 'dark'
					? 'none'
					: 'auto'}"
			>
				<p>Dark</p>
			</button>
		</div>

		<div class="mobile_color_switch">
			{#if $colorMode === 'light'}
				<button onclick={() => colorMode.set('dark')} aria-label="Switch to dark mode">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
						><path
							d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"
						/></svg
					>
				</button>
			{:else}
				<button onclick={() => colorMode.set('light')} aria-label="Switch to light mode">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
						><path
							d="M380-160q133 0 226.5-93.5T700-480q0-133-93.5-226.5T380-800h-21q-10 0-19 2 57 66 88.5 147.5T460-480q0 89-31.5 170.5T340-162q9 2 19 2h21Zm0 80q-53 0-103.5-13.5T180-134q93-54 146.5-146T380-480q0-108-53.5-200T180-826q46-27 96.5-40.5T380-880q83 0 156 31.5T663-763q54 54 85.5 127T780-480q0 83-31.5 156T663-197q-54 54-127 85.5T380-80Zm80-400Z"
						/></svg
					>
				</button>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet navigator_container(isAbout: Boolean)}
	<div class="navigator_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
		<div class="navigator_links">
			<a
				href={resolve('/about')}
				style="opacity:{isAbout ? '1' : '0.5'}; pointer-events:{isAbout ? 'none' : 'auto'}"
			>
				<p>Info</p>
			</a>
		</div>

		<div class="mobile_navigator">
			<a href={resolve('/about')} aria-label="Navigate to about page">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
					><path
						d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
					/></svg
				>
			</a>
		</div>
	</div>
{/snippet}

<!--It's strange but in case of mobile we have the header only in the landing page, the others have another mechanism-->
{#if props.type === 'home'}
	<header id="mobile_home_header">
		<!--{@render colorswitch_container()}-->

		{@render navigator_container(false)}
		{@render colorswitch_container()}
		<div class="logo_container" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
			<!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 25">
				<path
					d="M12.999 0C19.7316 0 25.1894 5.45783 25.1895 12.1904C25.1895 18.9231 19.7317 24.3809 12.999 24.3809C6.26642 24.3808 0.808594 18.9231 0.808594 12.1904C0.808676 5.45788 6.26647 8.19504e-05 12.999 0ZM13.0557 1.00195C6.84562 1.00195 1.81055 6.03703 1.81055 12.2471C1.81077 18.4569 6.84576 23.4912 13.0557 23.4912C19.2654 23.491 24.2996 18.4568 24.2998 12.2471C24.2998 6.03716 19.2655 1.00218 13.0557 1.00195Z"
					fill="inherit"
				/>
				<path
					d="M6.93168 18.5363H4.87208L4.31543 17.0333L5.87405 15.8644L5.3174 14.5284L6.4307 12.0792V10.5206L6.93168 10.0752L6.4307 9.90825L6.76468 9.46294V9.18461L6.37503 9.46294L6.4307 6.06739L6.93168 6.45704L7.04301 6.06739L7.32133 6.45704H8.3233L8.71295 6.79103L8.49029 6.84669V6.95802H9.1026L10.4386 7.51467L10.1046 7.95999H8.43463V9.68559L9.1026 11.4669L9.60359 11.8565L9.77058 9.40727H12.3312L12.8321 9.90825L13.3331 9.40727H15.838L16.0607 11.8565L16.673 11.1885L17.341 9.40727L17.007 8.34964H16.005L15.671 7.40334L17.007 7.06935L17.174 6.62403H17.8976L18.0646 5.84473L19.2893 6.17872L20.0129 6.84669H19.4562L20.0129 7.84866H19.5676L20.0129 8.34964V9.40727L19.4562 8.90629L19.8459 9.68559L18.8996 10.6876L20.4025 14.4728L19.8459 15.9757L21.4045 16.9777V17.256L20.7922 18.5363H19.1779V17.9796H19.7346L20.0129 17.3673L18.3986 16.1984V15.9757L18.7883 14.9737L17.007 12.6915L17.508 11.9122L16.2277 12.6915L16.339 14.0274H13.5558L12.9435 14.6954L12.1085 14.0274H9.49226V12.6915L8.1563 11.9122L8.76861 12.5802L6.93168 14.9737V15.1407L7.32133 16.1984L5.70705 17.3673L5.98538 17.9796L6.93168 18.2023V18.5363Z"
					fill="inherit"
				/>
				<path
					d="M9.38093 15.1964L8.43463 13.9161L7.48833 14.9737V15.1964L7.98931 15.7531V16.0314L7.26567 17.4787V17.757L7.71098 18.5363L9.82625 18.592L9.93757 18.2023L8.71295 17.9796L8.43463 17.7013V17.3673L9.38093 15.5304V15.1964Z"
					fill="inherit"
				/>
				<path
					d="M18.1203 14.9737L17.341 13.9161L16.339 15.1964V15.4747L17.341 17.59L17.2297 17.8683H16.2277V18.5363H18.009L18.4543 17.6457V17.3673L17.7863 15.9757V15.7531L18.1203 15.3077V14.9737Z"
					fill="inherit"
				/>
				<path
					d="M4.31543 7.51467L3.92578 9.29594L4.3711 9.35161L4.31543 12.5802H4.87208L5.20607 13.9161L5.92971 11.9678L5.87405 9.18461L4.31543 7.51467Z"
					fill="inherit"
				/>
				<path
					d="M22.1838 10.0752V11.5225L21.1819 10.0196H20.9592L20.1799 10.8546V11.1885L20.9592 12.8585V13.2481L20.6252 13.9161H20.5139L19.4562 10.8546V10.6876L21.4045 8.62796H21.5158L22.1838 10.0752Z"
					fill="inherit"
				/>
			</svg>-->
			<h1 class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
				This is the portfolio of the <u
					><a href={resolve('/about')}>Collective Inquiries and Inventive Formats group </a></u
				> @ médialab Sciences Po
			</h1>
			<p class="notes" class:hidden={!isPageLoaded} class:transitioned={isPageLoaded}>
				All the projects listed are part of the collective effort of conducting participatory
				inquiries via design-first methods.
			</p>
		</div>
	</header>
{:else if props.type === 'project'}
	<header id="mobile_home_header" style="min-height: unset; height: fit-content;">
		{@render colorswitch_container()}
		<a
			class="hover_container"
			href={resolve('/')}
			id="backhome"
			data-sveltekit-preload-data
			aria-label="Back to home"
			style="left: var(--spacing-m); right: unset; align-items: flex-start;"
			class:hidden={!isPageLoaded}
			class:transitioned={isPageLoaded}
		>
			<!--<p class="notes">Back to home</p>-->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -720 700 800"
				><path
					d="M600-160v-360H272l64 64-56 56-160-160 160-160 56 56-64 64h328q33 0 56.5 23.5T680-520v360h-80Z"
				/>
			</svg>
		</a>
	</header>
{/if}

<header id="desktop_header">
	{#if props.type === 'home' || props.type === 'about'}
		{@render navigator_container(props.isAbout)}
		{@render logo_container()}
		{@render colorswitch_container()}
	{:else if props.type === 'project'}
		<a class="hover_container" href={resolve('/')} id="backhome">
			<!--<p class="notes">Back to home</p>-->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
				><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z" /></svg
			>
		</a>

		{@render colorswitch_container()}
	{/if}
</header>

<style>
	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: fit-content;
		padding-left: var(--spacing-l);
		padding-right: var(--spacing-l);
		padding-top: var(--spacing-m);
		padding-bottom: var(--spacing-m);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
	}

	.navigator_container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		row-gap: var(--spacing-xs);
		width: fit-content;
		height: 100%;
		background-color: var(--permanent-white);
		padding: var(--spacing-xs);
	}

	.navigator_links {
		display: flex;
		flex-direction: row;
		column-gap: var(--spacing-xs);
		justify-content: center;
		align-items: center;
	}

	.mobile_color_switch,
	.mobile_navigator {
		display: none;
	}

	.navigator_links > button > p,
	.navigator_links > p {
		color: var(--permanent-black);
	}

	.logo_container {
		display: flex;
		position: absolute;
		flex-direction: column;
		align-items: center;
		width: fit-content;
		height: fit-content;
		row-gap: var(--spacing-xs);
		background-color: var(--permanent-white);
		padding: var(--spacing-xs);
		left: 50%;
		top: var(--spacing-m);
		transform: translate(-50%);
		z-index: 1;
	}

	.logo_container > h1 {
		color: var(--permanent-black);
	}

	.logo_container > svg {
		width: 30px;
		height: 30px;
		fill: var(--permanent-black);
	}

	.hover_container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: fit-content;
		height: 100%;
		row-gap: var(--spacing-xs);
		background-color: var(--permanent-white);
		padding: var(--spacing-xs);
		z-index: 20;
	}

	#backhome {
		align-items: flex-end;
	}

	.hover_container > svg {
		fill: var(--permanent-black);
	}

	#mobile_home_header {
		display: none;
	}

	#desktop_header {
		display: flex;
	}

	p {
		color: var(--permanent-black);
	}

	@media (max-width: 768px) {
		header {
			width: 100%;
			height: 100%;
			min-height: 90vh;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1;
			display: block;
			place-content: center;
			align-items: center;
			padding: 0px;
			position: static;
		}

		.navigator_links {
			display: none;
		}
		.mobile_color_switch,
		.mobile_color_switch > button > svg,
		.mobile_navigator,
		.mobile_navigator > button > svg {
			display: block;
			width: 25px;
			height: 25px;
		}

		.logo_container {
			position: static;
			align-items: flex-start;
			width: 33ch;
			height: fit-content;

			row-gap: var(--spacing-s);
			background-color: transparent;
			padding: 0px;

			transform: translate(0%);
			z-index: 1;
			margin: var(--spacing-m);
		}

		.logo_container > svg {
			width: 35px;
			height: 35px;
			fill: var(--primary-black);
		}

		.logo_container > p {
			width: 35ch;
		}

		.logo_container > h1 {
			color: var(--primary-black);
		}

		#mobile_home_header {
			display: block;
			padding: 0px;
			margin: 0px;
		}

		#desktop_header {
			display: none;
		}

		.hover_container {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: center;
			width: fit-content;
			height: fit-content;

			position: absolute;
			top: var(--spacing-m);
			right: var(--spacing-m);

			row-gap: var(--spacing-xs);
			background-color: transparent;
			padding: 0px;
		}

		.hover_container > svg {
			fill: var(--primary-black);
		}

		p {
			color: var(--primary-black);
		}

		.navigator_container {
			height: fit-content;
			background-color: transparent;
			padding: 0px;
			position: absolute;
			top: var(--spacing-m);
			left: var(--spacing-m);
		}
	}
</style>
