import * as THREE from 'three';

export default class Skeleton {

    group: THREE.Group = new THREE.Group();

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

    // todo need to use different geometry/mesh for each bone
    constructor() {

        for (let bone_name of this.bone_names) {
            const geometry = new THREE.SphereGeometry(0.02, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

            const mesh = new THREE.Mesh(geometry, material);

            mesh.name = bone_name;

            this.group.add(mesh);
        }
    }

    setBonePositions(bone_positions: { [key: string]: THREE.Vector3 }) {


        this.bone_names.forEach((bone_name, i) => {

            const obj = this.group.getObjectByName(bone_name);

            if (obj) {
                obj.position.copy(bone_positions[bone_name]);
            }
        });
    }

}