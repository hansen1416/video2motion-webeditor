<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	onMount(() => {});

	onDestroy(() => {});

	let video: HTMLVideoElement;

	function uploadVideo(e: Event) {
		console.log(e.target);

		const inputs = e.target as HTMLInputElement;

		if (!inputs.files) {
			return;
		}

		const file = inputs.files[0];
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent) => {
			video.src = (e.target as FileReader).result as string;
		};
		reader.readAsDataURL(file);
	}
</script>

<section>
	<input type="file" accept="video/*" on:change={uploadVideo} />

	<video controls bind:this={video}>
		<track kind="captions" srclang="en" label="English" default />
	</video>
</section>

<style>
</style>
