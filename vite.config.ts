import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [imagetools(
		{
			removeMetadata: false,
		}
	), enhancedImages(), sveltekit()],
	server: {
		fs: {
			// Allow serving files from one level up (for svelte-pdf in parent directory)
			allow: ['..']
		}
	}
});
