<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import * as THREE from "three";
	import type { ApplyMethod, ControlType, DiaplayScene } from "../types";

	import Icon from "../icons/Icon.svelte";
	import {
		displayScene,
		controlType,
		currentRotation,
		selectedBone,
	} from "../store";
	import WebStorage from "../lib/WebStorage";

	let eulerX: number = 0;
	let eulerY: number = 0;
	let eulerZ: number = 0;

	let showEulerInputs: boolean = false;

	// when currentRotation change, update eulerX, eulerY, eulerZ
	currentRotation.subscribe((value: THREE.Euler | null) => {
		if (value) {
			eulerX = value.x;
			eulerY = value.y;
			eulerZ = value.z;

			showEulerInputs = true;
		} else {
			showEulerInputs = false;
		}
	});

	const dispatch = createEventDispatcher();

	let _controlType: ControlType = "";

	controlType.subscribe((value) => {
		_controlType = value;
	});

	function swicthDisplayScene(value: DiaplayScene) {
		displayScene.set(value);
		WebStorage.save("display_scene", value);
		if (value === "mesh") {
			selectedBone.set(null);
		}
	}

	function swicthControlType(value: ControlType) {
		if (value === _controlType) {
			controlType.set("");
			// hide the control when swicth to empty
			selectedBone.set(null);
		} else {
			controlType.set(value);
		}

		WebStorage.save("control_type", value);
	}

	function editRotation(interpolation: ApplyMethod) {
		const rot = new THREE.Euler(eulerX, eulerY, eulerZ);

		dispatch("edit_bone_rotation", {
			euler: rot,
			method: interpolation,
		});
	}
</script>

<section class="panel">
	<button
		on:click={() => {
			swicthDisplayScene("skeleton");
		}}
	>
		<Icon name="bones" />
	</button>
	<button
		on:click={() => {
			swicthDisplayScene("mesh");
		}}
	>
		<Icon name="mesh" />
	</button>
	<button
		on:click={() => {
			swicthControlType("translation");
		}}
	>
		<Icon name="axis" />
	</button>
	<button
		on:click={() => {
			swicthControlType("rotation");
		}}
	>
		<Icon name="rotate" />
	</button>
	{#if showEulerInputs}
		<label>
			<span>x:</span>
			<input bind:value={eulerX} />
		</label>
		<label>
			<span>y:</span>
			<input bind:value={eulerY} />
		</label>
		<label>
			<span>z:</span>
			<input bind:value={eulerZ} />
		</label>
		<button
			on:click={() => {
				editRotation("linear");
			}}
		>
			<span>apply linear</span>
		</button>
	{/if}
</section>

<style>
	.panel {
		position: absolute;
		top: 25vh;
		right: 30px;
		width: 60px;
		height: 50vh;
		background-color: rgba(200, 200, 200, 0.5);
		padding-top: 12px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.panel input {
		width: 60%;
		border: 0;
	}
</style>
