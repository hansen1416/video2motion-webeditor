export default class AnimationData {
    total_frames: number = 0;

    data: {[key: string]: [number, number, number][]} = {};

    constructor(data: {[key: string]: [number, number, number][]}) {
        this.data = data;
        this.total_frames = this.data[Object.keys(this.data)[0]].length;
    }



}