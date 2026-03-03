<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<Header type="project" isAbout={false} />

<section class="main_container">
	<div class="text_Container">
		<p class="about_text">
			<span class="bolder">This portfolio presents design not as a way to package answers</span>,
			but as a means to ask better questions. It brings together tools and formats—maps, games,
			exhibitions, fanzines—created to probe issues that often elude standard research methods.
			These objects are not results but instruments: epistemic artefacts crafted to generate data,
			provoke responses, and reveal what usually remains unseen, unspoken, and unnoticed. Rather
			than presenting a retrospective, this collection functions as a living archive—more akin to
			gleaning than to displaying—composed of fragments from ongoing inquiries. Each piece
			demonstrates a commitment to documenting and theorising design in both its material specifics
			and conceptual scope, linking tangible gestures to broader ways of knowing. Developed by a
			multidisciplinary team of designers, sociologists, artists, political scientists, and
			semioticians, this work takes place in experimental settings where the distinction between
			observer and participant becomes blurred. Drawing on Science and Technology Studies and
			pragmatist philosophy, we view problems not as static or given, but as relational,
			ever-changing, and shaped by the very methods employed to study them. To describe, in this
			context, is already to intervene. In assembling this portfolio, we propose a model of design
			research that resists closure, embraces complexity, and remains accountable to the social
			worlds it engages with.
		</p>
	</div>
	<a class="cta" href="mailto:donato.ricci@sciencespo.fr">
		<h2>Write us an email</h2>
		<svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px"
			><path
				d="m490-527 37 37 217-217-37-37-217 217ZM200-200h37l233-233-37-37-233 233v37Zm355-205L405-555l167-167-29-29-219 219-56-56 218-219q24-24 56.5-24t56.5 24l29 29 50-50q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T828-678L555-405ZM270-120H120v-150l285-285 150 150-285 285Z"
			/></svg
		>
	</a>
	<Footer />
</section>

<style>
	.cta {
		width: fit-content;
		padding: var(--spacing-s) var(--spacing-m);
		display: flex;
		flex-direction: row;
		gap: var(--spacing-s);
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
	}

	.main_container {
		display: flex;
		flex-direction: column;
		margin: var(--spacing-xxl) var(--spacing-l) var(--spacing-l) var(--spacing-l);
		row-gap: var(--spacing-l);
		padding-bottom: var(--spacing-xl);
	}

	.text_Container {
		width: 100%;
		height: max-content;
		padding-top: var(--spacing-m);
	}

	.about_text {
		font-size: 64px;
		color: var(--secondary-dark);
		line-height: 1.15;
		letter-spacing: -0.06em;
	}

	::selection {
		background-color: #ff0b0b;
		color: var(--color-surface);
	}

	.bolder {
		font-weight: 500;
		color: var(--primary-black);
	}

	@media (max-width: 768px) {
		.main_container {
			padding: 0px;
			row-gap: var(--spacing-m);
			margin: var(--spacing-xl) var(--spacing-m) var(--spacing-m) var(--spacing-m);
		}

		.about_text {
			font-size: 28px;
		}

		.cta {
			width: 100%;
		}
	}
</style>
