<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from "svelte";
	import * as THREE from "three";
	import * as noUiSlider from "nouislider";
	import "nouislider/dist/nouislider.css";
	import { selectedBone } from "../store";

	interface SlierHTMLElement extends HTMLElement {
		noUiSlider: any;
	}

	const dispatch = createEventDispatcher();

	export let min_value: number;

	export let max_value: number;

	export let initial_value: number;

	export let keyFrames: number[];

	let current_value: number = initial_value;

	let slider: HTMLElement;

	let _selectedBone: THREE.Object3D | null = null;

	let deleteFrameIdx: number | null = null;

	onMount(() => {
		// todo update range.min and max
		noUiSlider.create(slider, {
			start: [0],
			tooltips: {
				to: function (value: number) {
					return ~~value;
				},
			},
			range: {
				min: 0,
				max: 100,
			},
			// step: 1,
			pips: {
				mode: "steps" as any,
				density: 1,
			},
		});

		(slider as SlierHTMLElement).noUiSlider.on(
			"change.one",
			function (values: number[]) {
				current_value = ~~values[0];
				dispatch("update", { frame_idx: current_value });
			},
		);
	});

	$: if (
		min_value !== undefined &&
		max_value !== undefined &&
		slider !== undefined &&
		(slider as SlierHTMLElement).noUiSlider !== undefined
	) {
		(slider as SlierHTMLElement).noUiSlider.updateOptions({
			range: {
				min: min_value,
				max: max_value,
			},
		});
	}

	onDestroy(() => {
		if (slider) {
			(slider as SlierHTMLElement).noUiSlider.destroy();
		}
	});

	selectedBone.subscribe((value: THREE.Object3D | null) => {
		_selectedBone = value;
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
					disabled={!_selectedBone}
				>
					<span>Add Keyframe</span>
				</button>
				<button
					on:click={() => {
						dispatch("deleteKeyframe", {
							frame_idx: deleteFrameIdx,
						});
						// do this in a callback is more proper, settle for now
						deleteFrameIdx = null;
					}}
					disabled={deleteFrameIdx === null}
				>
					<span>Delete Keyframe</span>
				</button>
			</div>
		</div>
		<div></div>
	</div>
	<div bind:this={slider}></div>
	{#each keyFrames as value, idx (value)}
		<button
			on:click={() => {
				deleteFrameIdx = value;
			}}
		>
			<div
				class="keyframe"
				style="left: {(value / max_value) * 100}%"
			></div>
		</button>
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
		top: 20px;
		width: 10px;
		height: 30px;
		background-color: #000;
	}
</style>
