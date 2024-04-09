export type QuaternionArray = [number, number, number, number];

export type AnimationDataObject = { [key: string]: QuaternionArray[] };

export type AnimationFrameDataObject = { [key: string]: QuaternionArray }

export default class AnimationData {

    data: AnimationDataObject = {};

    total_frames: number = 0;

    constructor(data: AnimationDataObject) {
        this.loadData(data);
    }

    loadData(data: AnimationDataObject) {

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

}