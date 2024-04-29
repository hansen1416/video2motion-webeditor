<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from "svelte";
	import * as THREE from "three";

	import Icon from "../icons/Icon.svelte";
	import { display_scene, control_type } from "../store";
	import WebStorage from "../lib/WebStorage";

	export let current_bone_rotation: THREE.Euler;

	const dispatch = createEventDispatcher();

	let _control_type: "rotation" | "translation" | "" = "";

	control_type.subscribe((value) => {
		_control_type = value;
	});

	function editRotation(e: Event) {
		const value = parseFloat((e.target as HTMLInputElement).value);

		current_bone_rotation.x = value;

		dispatch("edit_bone_rotation", current_bone_rotation);
	}
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
			if (_control_type === "translation") {
				control_type.set("");
			} else {
				control_type.set("translation");
			}

			WebStorage.save("control_type", "translation");
		}}
	>
		<Icon name="axis" />
	</button>
	<button
		on:click={() => {
			if (_control_type === "rotation") {
				control_type.set("");
			} else {
				control_type.set("rotation");
			}

			WebStorage.save("control_type", "rotation");
		}}
	>
		<Icon name="rotate" />
	</button>
	<label>
		<span>x:</span>
		<input bind:value={current_bone_rotation.x} on:change={editRotation} />
	</label>
	<label>
		<span>y:</span>
		<input bind:value={current_bone_rotation.y} on:change={editRotation} />
	</label>
	<label>
		<span>z:</span>
		<input bind:value={current_bone_rotation.z} on:change={editRotation} />
	</label>
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
