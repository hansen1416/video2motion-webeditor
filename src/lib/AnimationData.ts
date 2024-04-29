import * as THREE from "three";

import type { AnimationDataObject, AnimationFrameDataObject } from "../types";

export default class AnimationData {

    total_frames: number = 0;

    data: AnimationDataObject = {};

    bones: { [key: string]: THREE.Bone } = {};

    current_frame: number = 0;

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
        // todo edit animation data at `current_frame`, on bone `bone_name`

        // todo then apply the rotation to the bone
    }

}