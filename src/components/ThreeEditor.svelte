<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Slider from "../components/Slider.svelte";
	import Stats from "three/examples/jsm/libs/stats.module.js";

	import ThreeScene from "../lib/ThreeScene";
	import AnimationData from "../lib/AnimationData";
	import { loadGLTF, loadJSON } from "../utils/ropes";

	let canvas: HTMLCanvasElement;

	let threeScene: ThreeScene;

	let stats: Stats;

	let animation_pointer = 0;

	let animtion_data: AnimationData;

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

			animtion_data = new AnimationData(anim_data);

			console.log(animtion_data);
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
		<Slider
			init_value={0}
			min_value={0}
			max_value={animtion_data ? animtion_data.total_frames : 100}
		/>
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
