import * as THREE from "three";

import type { QuaternionArray, AnimationDataObject, AnimationFrameDataObject } from "../types";
import { insertIntoSortedArray } from "../utils/ropes";

export default class AnimationData {

    total_frames: number = 0;

    current_frame: number = 0;

    data: AnimationDataObject = {};

    bones: { [key: string]: THREE.Bone } = {};

    keyframes: { [key: string]: number[] } = {}

    constructor() {

    }

    loadData(data: AnimationDataObject, bones: { [key: string]: THREE.Bone }) {

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

        this.current_frame = frame_idx;

        let frame_data = this.getFrameData(frame_idx);

        for (let key in frame_data) {
            if (!this.bones[key]) {
                continue;
            }
            this.bones[key].quaternion.fromArray(frame_data[key]);
        }
    }

    editBoneFrameRotation(bone_name: string, rotation: THREE.Euler) {

        const q = new THREE.Quaternion().setFromEuler(rotation);
        // edit animation data at `current_frame`, on bone `bone_name`
        this.data[bone_name][this.current_frame] = q.toArray() as QuaternionArray;

        // then apply the rotation to the bone
        this.applyRotation(this.current_frame);

        this.addKeyFrame(bone_name, this.current_frame);
    }

    addKeyFrame(bone_name: string, frame_idx: number) {
        if (!this.keyframes[bone_name]) {
            this.keyframes[bone_name] = [];
        }

        this.keyframes[bone_name] = insertIntoSortedArray(this.keyframes[bone_name], frame_idx);
    }

    getBoneKeyFrames(bone_name: string) {
        return this.keyframes[bone_name] ?? [];
    }

    // generateBoneKeyFrames(bone_name: string) {
    //     const bones_data = this.data[bone_name];

    //     const velocities: THREE.Vector3[] = [];

    //     for (let i = 1; i < bones_data.length - 1; i++) {
    //         const q0 = new THREE.Quaternion().fromArray(bones_data[i - 1]);
    //         const q1 = new THREE.Quaternion().fromArray(bones_data[i]);
    //         // the rotation difference between two frames
    //         const v0 = new THREE.Vector3(0, 1, 0);

    //         v0.applyQuaternion(q0);

    //         const v1 = new THREE.Vector3(0, 1, 0);

    //         v1.applyQuaternion(q1);

    //         const v = v1.clone().sub(v0);

    //         velocities.push(v);
    //     }

    //     const angles = []

    //     for (let i = 0; i < velocities.length - 1; i++) {
    //         const v0 = velocities[i];
    //         const v1 = velocities[i + 1];

    //         const angle = v0.angleTo(v1);

    //         angles.push(angle);
    //     }

    //     console.log(angles);
    // }
}