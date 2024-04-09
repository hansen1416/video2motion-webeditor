<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { ComponentEvents } from "svelte";
	import * as THREE from "three";
	import Stats from "three/examples/jsm/libs/stats.module.js";

	import FrameSlider from "./FrameSlider.svelte";
	import ThreeScene from "../lib/ThreeScene";
	import AnimationData from "../lib/AnimationData";
	import type { AnimationDataObject } from "../lib/AnimationData";
	import Skeleton from "../lib/Skeleton";
	import { loadGLTF, loadJSON } from "../utils/ropes";

	let canvas: HTMLCanvasElement;

	let threeScene: ThreeScene;

	let stats: Stats;

	let animation_pointer = 0;

	let animtion_data: AnimationData = new AnimationData({});

	let total_frames = 0;

	let bones: { [key: string]: THREE.Object3D } = {};

	let skeleton = new Skeleton();

	let diva: THREE.Object3D;

	let initial_frame = 0;

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
			loadJSON(
				`/anim-calculated-quaternion/180 Turn W_ Briefcase (1)-30-0.json`,
			),
		]).then(([gltf, anim_data]) => {
			diva = gltf.scene.children[0];

			diva.name = "diva";

			diva.position.set(0, -1, 0);

			threeScene.scene.add(diva);

			diva.traverse((node: THREE.Object3D) => {
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

			animtion_data.loadData(anim_data as AnimationDataObject);

			total_frames = animtion_data.total_frames;

			// initial frame
			setBoneRotation(initial_frame);

			setBonePosition();

			setDivaOpacity(0.6);

			threeScene.scene.add(skeleton.mesh);
		});
	});

	onDestroy(() => {
		// unsubscribe all stores
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});

	function setDivaOpacity(opacity: number): void {
		for (const child of diva.children) {
			if (child instanceof THREE.SkinnedMesh === false) continue;

			const mat = (child as THREE.SkinnedMesh)
				.material as THREE.MeshStandardMaterial;

			mat.transparent = true;
			mat.opacity = opacity;
		}
	}

	function setBoneRotation(frame_idx: number) {
		const current_pose = animtion_data.getFrameData(frame_idx);

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

	function setBonePosition() {
		const bone_positions: { [key: string]: THREE.Vector3 } = {};

		diva.traverse((node: THREE.Object3D) => {
			// @ts-ignore
			if (node.isBone) {
				const v = new THREE.Vector3();

				node.getWorldPosition(v);

				bone_positions[node.name] = v;
			}
		});

		skeleton.setBonePositions(bone_positions);
	}

	function frameUpdateCallback(
		event: ComponentEvents<FrameSlider>["update"],
	) {
		if (!animtion_data || !bones || !diva) {
			return;
		}

		setBoneRotation(event.detail.frame_idx);

		setBonePosition();
	}
</script>

<section>
	<canvas bind:this={canvas} />

	<div class="control-box">
		<FrameSlider
			min_value={0}
			max_value={total_frames}
			initial_value={initial_frame}
			on:update={frameUpdateCallback}
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
