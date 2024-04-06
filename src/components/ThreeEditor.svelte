<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import Stats from "three/examples/jsm/libs/stats.module.js";

	import Slider from "../components/Slider.svelte";
	import ThreeScene from "../lib/ThreeScene";
	import AnimationData, {
		type AnimationFrameDataObject,
	} from "../lib/AnimationData";
	import { loadGLTF, loadJSON } from "../utils/ropes";

	let canvas: HTMLCanvasElement;

	let threeScene: ThreeScene;

	let stats: Stats;

	let animation_pointer = 0;

	let animtion_data: AnimationData = new AnimationData({});

	let total_frames = 0;

	let current_pose: AnimationFrameDataObject = {};

	let bones: { [key: string]: THREE.Object3D } = {};

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

			glb_model.traverse((node: THREE.Object3D) => {
				// @ts-ignore
				if (node.isMesh) {
					node.castShadow = true;
				}
				// @ts-ignore
				if (node.isBone) {
					// @ts-ignore
					if (bones[node.name] === undefined) {
						// somehow maximo has double bones, so only use the first one
						bones[node.name] = node;
					}
				}
			});

			animtion_data.loadData(anim_data);

			total_frames = animtion_data.total_frames;
		});
	});

	onDestroy(() => {
		// unsubscribe all stores
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});

	$: if (animtion_data && bones) {
		current_pose = animtion_data.getFrameData();

		for (const bone_name in current_pose) {
			const bone = bones[bone_name];

			if (bone) {
				const [x, y, z, w] = current_pose[bone_name];

				bone.rotation.setFromQuaternion(
					new THREE.Quaternion(x, y, z, w),
				);
			}
		}
	}
</script>

<section>
	<canvas bind:this={canvas} />

	<div class="control-box">
		<Slider
			min_value={0}
			max_value={total_frames}
			bind:value={animtion_data.current_frame}
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
