<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let min_value: number;

	export let max_value: number;

	export let initial_value: number;

	export let keyFrames: number[];
	// todo add keytfames to the slider

	let value: number = initial_value;

	let slider_input: HTMLInputElement;

	onMount(() => {
		slider_input.oninput = (e: Event) => {
			value = parseInt((e.target as HTMLInputElement).value);

			dispatch("update", { frame_idx: value });
		};
	});

	onDestroy(() => {
		// console.log("destroyed");
	});
</script>

<div class="slidecontainer">
	<div class="scales">
		<div>{value}</div>
		<div></div>
	</div>
	<input
		bind:this={slider_input}
		type="range"
		min={min_value}
		max={max_value}
		{value}
		class="slider"
		id="myRange"
	/>
	{#each keyFrames as value, idx (value)}
		<div class="keyframe">keyframe</div>
	{/each}
</div>

<style>
	.slidecontainer {
		width: 100%; /* Width of the outside container */
	}

	/* The slider itself */
	.slider {
		-webkit-appearance: none; /* Override default CSS styles */
		appearance: none;
		width: 100%; /* Full-width */
		height: 30px; /* Specified height */
		background: #d3d3d3; /* Grey background */
		outline: none; /* Remove outline */
		opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
		-webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
		transition: opacity 0.2s;
		border: 0;
		padding: 0;
		margin: 0;
	}

	/* Mouse-over effects */
	.slider:hover {
		opacity: 1; /* Fully shown on mouse-over */
	}

	/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none; /* Override default look */
		appearance: none;
		width: 10px; /* Set a specific slider handle width */
		height: 30px; /* Slider handle height */
		background: #04aa6d; /* Green background */
		cursor: pointer; /* Cursor on hover */
	}

	.slider::-moz-range-thumb {
		width: 25px; /* Set a specific slider handle width */
		height: 25px; /* Slider handle height */
		background: #04aa6d; /* Green background */
		cursor: pointer; /* Cursor on hover */
	}

	.scales {
		width: 100%;
		height: 30px;
		text-align: left;
	}

	.keyframe {
		position: absolute;
		top: 30px;
		width: 10px;
		height: 32px;
		background-color: #fff;
	}
</style>
