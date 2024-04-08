import * as THREE from 'three';


export default class Skeleton {

    group: THREE.Group = new THREE.Group();

    mesh: THREE.InstancedMesh;


    bone_names: Array<string> = [
        "Hips",
        "Spine",
        "Spine1",
        "Spine2",
        "Neck",
        "Head",
        "HeadTop_End",
        "LeftEye",
        "RightEye",
        "LeftShoulder",
        "LeftArm",
        "LeftForeArm",
        "LeftHand",
        "RightShoulder",
        "RightArm",
        "RightForeArm",
        "RightHand",
        "LeftUpLeg",
        "LeftLeg",
        "LeftFoot",
        "LeftToeBase",
        "LeftToe_End",
        "RightUpLeg",
        "RightLeg",
        "RightFoot",
        "RightToeBase",
        "RightToe_End"
    ]

    constructor() {
        this.mesh = this.init();
    }

    init() {
        const geometry = new THREE.SphereGeometry(0.02, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const instanceCount = this.bone_names.length;

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

    setBonePositions(bone_positions: { [key: string]: THREE.Vector3 }) {
        this.bone_names.forEach((bone_name, i) => {
            const bone_position = bone_positions[bone_name];
            if (bone_position) {
                const matrix = new THREE.Matrix4();
                matrix.setPosition(bone_position);
                this.mesh.setMatrixAt(i, matrix);
            }
        });
    }

}