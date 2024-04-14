<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { ComponentEvents } from "svelte";
	import * as THREE from "three";

	import Icon from "../icons/Icon.svelte";
</script>

<section class="panel">
	<Icon name="bones" />
	<Icon name="mesh" />
	<Icon name="axis" />
	<Icon name="rotate" />
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
