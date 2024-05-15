<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from "svelte";
	import * as noUiSlider from "nouislider";
	import "nouislider/dist/nouislider.css";
	import { slide } from "svelte/transition";

	interface SlierHTMLElement extends HTMLElement {
		// Add your custom properties here
		noUiSlider: any;
	}

	const dispatch = createEventDispatcher();

	export let min_value: number;

	export let max_value: number;

	export let initial_value: number;

	export let keyFrames: number[];

	let current_value: number = initial_value;

	let slider: SlierHTMLElement;

	onMount(() => {
		// todo update range.min and max
		noUiSlider.create(slider, {
			start: [0],
			tooltips: {
				to: function (value) {
					return ~~value;
				},
			},
			range: {
				min: 0,
				max: 100,
			},
			step: 1,
			pips: {
				mode: "steps" as any,
				density: 1,
			},
		});

		slider.noUiSlider.on("change.one", function (values: number[]) {
			current_value = ~~values[0];
			dispatch("update", { frame_idx: current_value });
		});
	});

	onDestroy(() => {
		// console.log("destroyed");
	});
</script>

<div class="slidecontainer">
	<div class="scales">
		<div class="scale-panel">
			<div>
				<button
					on:click={() => {
						dispatch("addKeyframe", { frame_idx: current_value });
					}}
				>
					<span>Key</span>
				</button>
			</div>
		</div>
		<div></div>
	</div>
	<div bind:this={slider}></div>
	{#each keyFrames as value, idx (value)}
		<div class="keyframe" style="left: {(value / max_value) * 100}%"></div>
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

	.scales .scale-panel {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.keyframe {
		position: absolute;
		top: 30px;
		width: 10px;
		height: 32px;
		background-color: #000;
	}
</style>
