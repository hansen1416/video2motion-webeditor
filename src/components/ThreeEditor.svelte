<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { ComponentEvents } from "svelte";
	import * as THREE from "three";
	import Stats from "three/examples/jsm/libs/stats.module.js";

	import FrameSlider from "./FrameSlider.svelte";
	import Panel from "./Panel.svelte";
	import ThreeScene from "../lib/ThreeScene";
	import AnimationData from "../lib/AnimationData";
	import type { AnimationDataObject } from "../lib/AnimationData";
	import Skeleton from "../lib/Skeleton";
	import { RotationControl, TranslationControl } from "../lib/Controls";
	import { loadGLTF, loadJSON } from "../utils/ropes";
	import { display_scene, control_type } from "../store";

	let canvas: HTMLCanvasElement;

	let threeScene: ThreeScene;

	let stats: Stats;

	let animation_pointer = 0;

	let total_frames = 0;

	let initial_frame = 0;

	let animtionData: AnimationData = new AnimationData();

	let bones: { [key: string]: THREE.Object3D } = {};

	let diva: THREE.Object3D;

	const raycaster = new THREE.Raycaster();

	const mouse = new THREE.Vector2();

	let intersects: THREE.Intersection[] = [];

	let skeleton = new Skeleton();
	let rotationControl = new RotationControl();
	let translationControl = new TranslationControl();

	let _control_type: "rotation" | "translation" = "rotation";

	function animate() {
		if (threeScene) {
			raycaster.setFromCamera(mouse, threeScene.camera);

			intersects = raycaster.intersectObjects(
				skeleton.group.children,
				true,
			);

			// update physics world and threejs renderer
			threeScene.onFrameUpdate(stats);
		}
		animation_pointer = requestAnimationFrame(animate);
	}

	onMount(() => {
		threeScene = new ThreeScene(
			canvas,
			document.documentElement.clientWidth,
			document.documentElement.clientHeight,
		);

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

					const mat = (node as THREE.SkinnedMesh)
						.material as THREE.MeshStandardMaterial;

					mat.transparent = true;
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

			// add the controls we need
			threeScene.scene.add(skeleton.group);
			threeScene.scene.add(rotationControl.group);
			threeScene.scene.add(translationControl.group);

			// initial animation data begin
			animtionData.loadData(anim_data as AnimationDataObject, bones);

			total_frames = animtionData.total_frames;

			// initial frame
			animtionData.applyRotation(initial_frame);

			skeleton.setBones(bones);

			skeleton.updateBonePositions();
			// initial animation data end

			canvas.addEventListener("mousemove", onMouseMove);
			canvas.addEventListener("click", onClick);

			animate();

			// this subscribe must happen after the scene is loaded
			display_scene.subscribe((value) => {
				if (value === "skeleton") {
					skeleton.show();

					_setDivaOpacity(0.6);
				} else {
					skeleton.hide();

					_setDivaOpacity(1);
				}
			});
		});
	});

	onDestroy(() => {
		// unsubscribe all stores
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});

	/**
	 * mouse position for interactions
	 */
	function onMouseMove(event: MouseEvent) {
		event.preventDefault();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	function onClick(event: MouseEvent) {
		event.preventDefault();

		if (intersects.length === 0) {
			return;
		}

		// selected bone
		const bone = intersects[0].object;

		if (_control_type === "rotation") {
			rotationControl.show(bone.position);
			translationControl.hide();
		} else if (_control_type === "translation") {
			translationControl.show(bone.position);
			rotationControl.hide();
		}

		// todo, add rotation, translation control
	}

	$: if (intersects.length > 0) {
		skeleton.highlightBone(intersects[0].object.name);
	} else {
		skeleton.highlightBone("");
	}

	control_type.subscribe((value) => {
		_control_type = value as "rotation" | "translation";

		// todo check if the bone is selected, if yes, switch the control
	});

	function _setDivaOpacity(opacity: number): void {
		for (const child of diva.children) {
			if (child instanceof THREE.SkinnedMesh === false) continue;

			const mat = (child as THREE.SkinnedMesh)
				.material as THREE.MeshStandardMaterial;

			mat.opacity = opacity;
		}
	}

	/**
	 * update frame callback, set bone rotations and positions
	 * @param event
	 */
	function frameUpdateCallback(
		event: ComponentEvents<FrameSlider>["update"],
	) {
		if (!animtionData || !bones || !diva) {
			return;
		}

		animtionData.applyRotation(event.detail.frame_idx);

		skeleton.updateBonePositions();
	}
</script>

<section class="three-editor">
	<canvas bind:this={canvas} />

	<div class="control-box">
		<FrameSlider
			min_value={0}
			max_value={total_frames}
			initial_value={initial_frame}
			on:update={frameUpdateCallback}
		/>
	</div>

	<Panel />
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
