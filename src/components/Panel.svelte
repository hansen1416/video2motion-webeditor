<script lang="ts">
	import Icon from "../icons/Icon.svelte";
	import { display_scene, control_type } from "../store";
	import WebStorage from "../lib/WebStorage";
</script>

<section class="panel">
	<button
		on:click={() => {
			display_scene.set("skeleton");
			WebStorage.save("display_scene", "skeleton");
		}}
	>
		<Icon name="bones" />
	</button>
	<button
		on:click={() => {
			display_scene.set("mesh");
			WebStorage.save("display_scene", "mesh");
		}}
	>
		<Icon name="mesh" />
	</button>
	<button
		on:click={() => {
			control_type.set("translation");
			WebStorage.save("control_type", "translation");
		}}
	>
		<Icon name="axis" />
	</button>
	<button
		on:click={() => {
			control_type.set("rotation");
			WebStorage.save("control_type", "rotation");
		}}
	>
		<Icon name="rotate" />
	</button>
</section>

<style>
	.panel {
		position: absolute;
		top: 25vh;
		right: 30px;
		width: 60px;
		height: 50vh;
		background-color: rgba(200, 200, 200, 0.5);
	}
</style>
