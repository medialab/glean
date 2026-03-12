import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const sveltePdfSourceEntry = fileURLToPath(
	new URL('./src/lib/vendor/svelte-pdf/index.js', import.meta.url)
);

export default defineConfig({
	plugins: [
		imagetools({
			removeMetadata: false
		}),
		enhancedImages(),
		tailwindcss(),
		sveltekit()
	],
	resolve: {
		alias: {
			'svelte-pdf': sveltePdfSourceEntry
		}
	},
	optimizeDeps: {
		exclude: ['svelte-pdf']
	},
	ssr: {
		noExternal: ['svelte-pdf']
	},
	server: {
		fs: {
			// Allow serving files from one level up (for svelte-pdf in parent directory)
			allow: ['..']
		}
	}
});
