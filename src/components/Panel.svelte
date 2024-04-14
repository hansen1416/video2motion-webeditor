<script lang="ts">
	import Icon from "../icons/Icon.svelte";
	import { displayScene, controlType } from "../store";
</script>

<section class="panel">
	<button
		on:click={() => {
			displayScene.set("skeleton");
		}}
	>
		<Icon name="bones" />
	</button>
	<button
		on:click={() => {
			displayScene.set("mesh");
		}}
	>
		<Icon name="mesh" />
	</button>
	<button
		on:click={() => {
			controlType.set("translation");
		}}
	>
		<Icon name="axis" />
	</button>
	<button
		on:click={() => {
			controlType.set("rotation");
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
