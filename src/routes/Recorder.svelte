<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import Stats from "three/examples/jsm/libs/stats.module.js";

	import ThreeScene from "../lib/ThreeScene";
	import { loadGLTF } from "../utils/ropes";

	let video: HTMLVideoElement;

	let canvas: HTMLCanvasElement;

	let stats: Stats;

	let animation_pointer = 0;

	let threeScene: ThreeScene;

	let diva: THREE.Object3D;

	let bones: { [key: string]: THREE.Bone } = {};

	function animate() {
		if (threeScene) {
			// update physics world and threejs renderer
			threeScene.onFrameUpdate(stats);
		}
		animation_pointer = requestAnimationFrame(animate);
	}

	onMount(() => {
		threeScene = new ThreeScene(
			canvas,
			document.documentElement.clientWidth / 2,
			document.documentElement.clientHeight,
		);

		Promise.all([loadGLTF(`/glb/dors.glb`)]).then(([gltf]) => {
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

			animate();
		});
	});

	onDestroy(() => {
		cancelAnimationFrame(animation_pointer);

		threeScene.dispose();
	});

	function uploadVideo(e: Event) {
		console.log(e.target);

		const inputs = e.target as HTMLInputElement;

		if (!inputs.files) {
			return;
		}

		const file = inputs.files[0];
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent) => {
			video.src = (e.target as FileReader).result as string;
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
			<video controls={true} bind:this={video}>
				<track kind="captions" srclang="en" label="English" default />
			</video>
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
</style>
