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
	<div class="left-hand">
		<div class="input-box">
			<input type="file" accept="video/*" on:change={uploadVideo} />
		</div>
		<div class="video-box">
			<video controls={true} bind:this={video}>
				<track kind="captions" srclang="en" label="English" default />
			</video>
		</div>
	</div>
	<div class="right-hand"></div>
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
	}

	.left-hand,
	.right-hand {
		flex-grow: 1;
		flex-basis: 50%;
	}

	.left-hand {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.input-box {
		margin: 10px 0;
	}

	.video-box {
		max-width: 80%;
		max-height: 80%;
	}

	video {
		max-width: 100%;
		max-height: 100%;
	}
</style>
