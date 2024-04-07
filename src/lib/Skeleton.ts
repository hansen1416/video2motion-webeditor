import * as THREE from 'three';

export default class Skeleton {

    group: THREE.Group = new THREE.Group();

    mesh: THREE.InstancedMesh;

    constructor() {
        this.mesh = this.init();
    }

    init() {
        const geometry = new THREE.SphereGeometry(0.02, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const instanceCount = 20; // Number of instances

        // Create the InstancedMesh
        const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

        const start_x = -1

        for (let i = 0; i < instanceCount; i++) {

            const matrix = new THREE.Matrix4();

            matrix.setPosition(start_x + i * 0.05, 0, 0);

            instancedMesh.setMatrixAt(i, matrix)
        }

        return instancedMesh
    }

}