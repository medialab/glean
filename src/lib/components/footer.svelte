<script lang="ts">
	import gitLogo from '$lib/assets/github-mark.svg';
</script>

<footer
	class="fixed right-0 bottom-5 left-0 z-[100] flex h-fit w-full flex-row items-center justify-between py-5 max-md:static max-md:px-0"
>
	<p class="notes bg-white p-1.5 text-[#1f1f1f] ml-5">Privacy policy</p>
	<a
		class="bg-white p-1.5 text-[#1f1f1f] mr-5"
		href="https://github.com/medialab"
		target="_blank"
		rel="noopener noreferrer"
		data-sveltekit-preload-data
	>
		<img src={gitLogo} alt="GitHub" class="h-5 w-5" />
	</a>
</footer>
