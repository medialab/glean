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

<div
	id="pdf_viewer"
	class="pdf_viewer relative z-20 flex w-full place-content-center items-center justify-center overflow-hidden bg-transparent object-cover"
>
	<button
		onclick={nextPage}
		class="pointer-events-none absolute top-0 right-0 z-[4] flex h-full w-[30%] flex-col items-end justify-center bg-transparent"
	>
		<p
			class="notes pointer-events-auto z-[4] h-fit w-fit -translate-y-1/2 bg-(--permanent-white) px-2.5 py-1.25 text-[32px] text-(--permanent-black)"
		>
			→
		</p>
	</button>
	<button
		onclick={prevPage}
		class="pointer-events-none absolute top-0 left-0 z-[4] flex h-full w-[30%] flex-col items-start justify-center bg-transparent"
	>
		<p
			class="notes pointer-events-auto z-[4] h-fit w-fit -translate-y-1/2 bg-(--permanent-white) px-2.5 py-1.25 text-[32px] text-(--permanent-black)"
		>
			←
		</p>
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
	:global(.pdf_viewer > *) {
		margin: 0 !important;
	}

	:global(.null) {
		justify-items: center !important;
	}

	:global(#topBtn) {
		display: none !important;
	}
</style>
