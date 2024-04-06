<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	export let init_value: number;

	export let min_value: number;

	export let max_value: number;

	let slider_input: HTMLInputElement;

	let value = init_value;

	// output.innerHTML = slider.value; // Display the default slider value

	// // Update the current slider value (each time you drag the slider handle)
	// slider_input.oninput = function () {
	// 	output.innerHTML = this.value;
	// };

	onMount(() => {
		// console.log(slider_input);

		slider_input.oninput = (e: Event) => {
			value = parseInt((e.target as HTMLInputElement).value);
		};
	});

	onDestroy(() => {
		// console.log("destroyed");
	});
</script>

<div class="slidecontainer">
	<div>{value}</div>
	<input
		bind:this={slider_input}
		type="range"
		min={min_value}
		max={max_value}
		value="50"
		class="slider"
		id="myRange"
	/>
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
</style>
