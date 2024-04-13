import * as THREE from "three";

export type QuaternionArray = [number, number, number, number];

export type AnimationDataObject = { [key: string]: QuaternionArray[] };

export type AnimationFrameDataObject = { [key: string]: QuaternionArray }

export default class AnimationData {

    total_frames: number = 0;

    data: AnimationDataObject = {};

    bones: { [key: string]: THREE.Object3D } = {};

    constructor() {

    }

    loadData(data: AnimationDataObject, bones: { [key: string]: THREE.Object3D }) {

        this.bones = bones;

        if (!data || !Object.keys(data).length) {
            return;
        }

        this.data = data;
        this.total_frames = this.data[Object.keys(this.data)[0]].length - 1;
    }

    getFrameData(frame_idx: number): AnimationFrameDataObject {
        let frame_data: AnimationFrameDataObject = {};

        for (let key in this.data) {
            frame_data[key] = this.data[key][frame_idx];
        }

        return frame_data;
    }

    applyRotation(frame_idx: number) {
        let frame_data = this.getFrameData(frame_idx);

        for (let key in frame_data) {
            if (!this.bones[key]) {
                continue;
            }
            this.bones[key].quaternion.fromArray(frame_data[key]);
        }

        // for (const bone_name in frame_data) {
        // 	const bone = bones[bone_name];

        // 	if (bone) {
        // 		const [x, y, z, w] = frame_data[bone_name];

        // 		bone.rotation.setFromQuaternion(
        // 			new THREE.Quaternion(x, y, z, w),
        // 		);
        // 	}
        // }

    }

}