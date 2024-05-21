<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import Stats from "three/examples/jsm/libs/stats.module.js";
	import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

	import ThreeScene from "../lib/ThreeScene";
	import { loadGLTF } from "../utils/ropes";

	let video: HTMLVideoElement;

	let canvas: HTMLCanvasElement;

	let stats: Stats;

	let animation_pointer = 0;

	let threeScene: ThreeScene;

	let diva: THREE.Object3D;

	let bones: { [key: string]: THREE.Bone } = {};

	let videoReady = false;

	let poseLandmarker: PoseLandmarker;

	let startExtract = false;
	let videoDuration = 0;

	function animate() {
		if (threeScene) {
			// update physics world and threejs renderer
			threeScene.onFrameUpdate(stats);

			if (
				videoReady &&
				startExtract &&
				poseLandmarker &&
				video.currentTime <= videoDuration
			) {
				poseLandmarker.detectForVideo(
					video,
					video.currentTime * 1000,
					(result: Object) => {
						console.log(result);
					},
				);
			}
		}

		animation_pointer = requestAnimationFrame(animate);
	}

	onMount(() => {
		threeScene = new ThreeScene(
			canvas,
			document.documentElement.clientWidth / 2,
			document.documentElement.clientHeight,
		);

		Promise.all([
			loadGLTF(`/glb/dors.glb`),
			FilesetResolver.forVisionTasks(`/task-vision/`),
		]).then(([gltf, vision]) => {
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
						bones[node.name] = node as THREE.Bone;
					}
				}
			});

			PoseLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: `/task-vision/pose_landmarker_lite.task`,
					delegate: "GPU",
				},
				runningMode: "VIDEO",
				numPoses: 1,
			}).then((landmarker: PoseLandmarker) => {
				poseLandmarker = landmarker;
			});

			animate();
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});

	function uploadVideo(e: Event) {
		const inputs = e.target as HTMLInputElement;

		if (!inputs.files) {
			return;
		}

		const file = inputs.files[0];
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent) => {
			video.src = (e.target as FileReader).result as string;
		};

		video.onloadedmetadata = () => {
			videoDuration = video.duration;
		};

		video.onloadeddata = () => {
			if (poseLandmarker) {
				videoReady = true;
			}
		};

		reader.readAsDataURL(file);
	}
</script>

<section>
	<div class="left-hand">
		<div class="input-box">
			<input type="file" accept="video/*" on:change={uploadVideo} />
		</div>
		<div class="video-box">
			<video controls={false} bind:this={video}>
				<track kind="captions" srclang="en" label="English" default />
			</video>
		</div>
		<div class="extract">
			<button
				disabled={!videoReady || !video}
				class:disabled={startExtract}
				on:click={() => {
					startExtract = !startExtract;

					if (video) {
						video.currentTime = 0;
						video.play();
					}
				}}>Extract</button
			>
		</div>
	</div>
	<div class="right-hand">
		<canvas bind:this={canvas} />
	</div>
</section>

<style>
	.left-hand,
	.right-hand {
		position: absolute;
		width: 50vw;
		height: 100vh;
		top: 0;
	}

	.left-hand {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		left: 0;
	}

	.right-hand {
		right: 0;
	}

	.input-box {
		margin: 10px 0;
	}

	.video-box {
		max-width: 80%;
		max-height: 80%;
	}

	video {
		max-width: 100%;
		max-height: 100%;
	}

	.extract {
		position: absolute;
		top: 50%;
		right: -48px;
		width: 96px;
		height: 32px;
		font-size: 18px;
		background-color: #fff;
		text-align: center;
		line-height: 30px;
		z-index: 2;
	}

	.extract button {
		width: 100%;
		height: 100%;
	}

	.extract button.disabled {
		opacity: 0.5;
	}
</style>
