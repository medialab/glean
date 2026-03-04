<script lang="ts">
	import PdfViewer from 'svelte-pdf';
	import type { PdfWrapperProps } from '$lib/types';

	let props: PdfWrapperProps = $props();

	let pdfPage = $state(1);

	// Functions to control page navigation
	function nextPage() {
		if (props.twoPage) {
			if (pdfPage % 2 === 0) {
				pdfPage++;
			} else {
				pdfPage += 2;
			}
		} else {
			pdfPage++;
		}
	}

	function prevPage() {
		if (props.twoPage) {
			if (pdfPage % 2 === 0) {
				pdfPage--;
			} else {
				pdfPage -= 2;
			}
		} else {
			pdfPage--;
		}
	}
</script>

<div id="pdf_viewer" class="pdf_viewer">
	<button onclick={nextPage} class="navigator_container dx">
		<p class="navigator_button notes">→</p>
	</button>
	<button onclick={prevPage} class="navigator_container sx">
		<p class="navigator_button notes">←</p>
	</button>
	<PdfViewer
		url={props.mediafile.default}
		showButtons={[]}
		pageNum={pdfPage}
		showBorder={false}
		scale={props.scale}
		twoPage={props.twoPage}
	/>
</div>

<style>
	.navigator_button {
		width: fit-content;
		height: fit-content;
		background-color: var(--permanent-white);
		padding: calc(var(--spacing) * 1.25) calc(var(--spacing) * 2.5);
		cursor: pointer;
		color: var(--permanent-black);
		top: 50%;
		transform: translateY(-50%);
		z-index: 4;
		font-size: 32px;
	}

	:global(.pdf_viewer > *) {
		margin: 0px !important;
	}

	.pdf_viewer {
		place-content: center;
		align-items: center;
		position: relative;
		justify-content: center;
		/* Keep the viewer itself interactive */
		z-index: 20;
		pointer-events: auto;
	}

	:global(.null) {
		justify-items: center !important;
	}

	:global(#topBtn) {
		display: none !important;
	}

	.pdf_viewer {
		width: 100%;
		height: auto;
		object-fit: cover;
		overflow: hidden;
		background-color: transparent;
	}

	.navigator_container {
		background-color: transparent;
		z-index: 4;
		position: absolute;
		top: 0px;
		height: 100%;
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* Let clicks pass through the transparent overlay except on the actual button */
		pointer-events: none;
	}

	/* The visible arrow should still be clickable */
	.navigator_button {
		pointer-events: auto;
	}

	.dx {
		align-items: flex-end;
		right: 0px;
	}

	.sx {
		align-items: flex-start;
		left: 0px;
	}
</style>
