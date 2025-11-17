<script>
	import gitLogo from '$lib/assets/github-mark.svg';
</script>

<footer>
	<p class="notes">Privacy policy</p>
	<a
		href="https://github.com/medialab"
		target="_blank"
		rel="noopener noreferrer"
		data-sveltekit-preload-data
	>
		<img src={gitLogo} alt="GitHub" style="width: 20px; height: 20px;" />
	</a>
</footer>

<style>
	footer {
		width: 100%;
		height: fit-content;
		padding: var(--spacing-m) var(--spacing-l);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}

	footer > * {
		background-color: var(--permanent-white);
		color: var(--permanent-black);
		padding: var(--spacing-xs);
	}

	@media (max-width: 768px) {
		footer {
			position: static;
			padding: var(--spacing-m) 0px var(--spacing-m) 0px;
		}
	}
</style>
