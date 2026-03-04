declare module 'svelte-pdf' {
	import type { Component } from 'svelte';

	const PdfViewer: Component<Record<string, unknown>>;

	export { PdfViewer };
	export default PdfViewer;
}
