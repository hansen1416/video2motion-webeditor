import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader.js";
// @ts-ignore
import { type GLTF } from "@types/three/examples/jsm/loaders/GLTFLoader.d.ts"
// @ts-ignore
import { type BVH } from "@types/three/examples/jsm/loaders/BVHLoader.d.ts"
import * as THREE from "three";

export function loadBVH(url: string): Promise<BVH> {
    return new Promise((resolve) => {
        const loader = new BVHLoader();
        loader.load(url,
            (result) => resolve(result),
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log(error);
            });
    });
}

export function loadGLTF(url: string): Promise<GLTF> {
    return new Promise((resolve) => {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => resolve(gltf));
    });
}

export function loadFBX(url: string): Promise<THREE.Group> {
    return new Promise((resolve) => {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            url,
            (object) => {
                resolve(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log(error);
            }
        );
    });
}

export function loadJSON(url: string): Promise<object> {
    return new Promise((resolve) => {
        fetch(url).then((response) => resolve(response.json()));
    });
}

export function loadObj(url: string): Promise<THREE.Group> {
    return new Promise((resolve) => {
        const loader = new OBJLoader();
        loader.load(url, (fbx) => resolve(fbx));
    });
}

export function getNamedIntersects(
    intersects: THREE.Intersection[],
): THREE.Intersection | null {
    let valid_obj: THREE.Intersection | null = null;

    for (const intersect of intersects) {
        if (intersect.object.name) {
            valid_obj = intersect;

            break;
        }
    }

    return valid_obj;
}


export function setMeshOpacity(object3d: THREE.Object3D, opacity: number): void {
    for (const child of object3d.children) {
        if (child instanceof THREE.SkinnedMesh === false) continue;

        const mat = (child as THREE.SkinnedMesh)
            .material as THREE.MeshStandardMaterial;

        mat.opacity = opacity;
    }
}

export function getMousePosition(event: MouseEvent): { "x": number, "y": number } {
    const x: number = (event.clientX / window.innerWidth) * 2 - 1;
    const y: number = -(event.clientY / window.innerHeight) * 2 + 1;
    return { x: x, y: y }
}