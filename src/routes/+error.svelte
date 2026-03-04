<script lang="ts">
	import { resolve } from '$app/paths';

	let { status, error } = $props();

	const message =
		typeof error === 'object' && error !== null && 'message' in error
			? String((error as { message?: unknown }).message ?? 'Unexpected error')
			: 'Unexpected error';
</script>

<section class="flex min-h-[70vh] w-full flex-col items-start justify-center gap-5 px-10 py-20 max-md:px-5">
	<p class="notes">Error {status}</p>
	<h1 class="max-w-[24ch]">{message}</h1>
	<a href={resolve('/')} class="bg-surface px-2 py-1 text-primary">
		Back to home
	</a>
</section>
