<script>
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import ThreeScene from "../lib/ThreeScene";
	import Slider from "../components/Slider.svelte";
	import Stats from "three/examples/jsm/libs/stats.module.js";
	import { loadGLTF, loadJSON } from "../utils/ropes";

	/** @type {HTMLCanvasElement} */
	let canvas;

	/** @type {ThreeScene} */
	let threeScene;
	/** @type {Stats} */
	let stats;

	let animation_pointer = 0;

	function animate() {
		// update physics world and threejs renderer
		threeScene.onFrameUpdate(stats);

		animation_pointer = requestAnimationFrame(animate);
	}

	onMount(() => {
		threeScene = new ThreeScene(
			canvas,
			document.documentElement.clientWidth,
			document.documentElement.clientHeight,
		);

		animate();

		Promise.all([
			loadGLTF(`/glb/dors.glb`),
			loadJSON(`/anim-json/180 Turn W_ Briefcase (1)-30-0.json`),
		]).then(([gltf, anim_data]) => {
			const glb_model = gltf.scene.children[0];

			glb_model.name = "diva";

			glb_model.position.set(0, -1, 0);

			threeScene.scene.add(glb_model);

			console.log(anim_data);
		});
	});

	onDestroy(() => {
		// unsubscribe all stores
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});
</script>

<section>
	<canvas bind:this={canvas} />

	<div class="control-box">
		<Slider init_value={30} min_value={0} max_value={300} />
	</div>
</section>

<style>
	canvas {
		width: 100vw;
		height: 100vh;
		display: block;
	}

	.control-box {
		width: 80vw;
		height: 80px;
		position: absolute;
		left: 50%;
		bottom: 30px;
		margin-left: -40vw;
	}
</style>
