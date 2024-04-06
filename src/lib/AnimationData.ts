export default class AnimationData {    

    data: {[key: string]: [number, number, number][]} = {};

    total_frames: number = 0;

    _current_frame: number = 0;

    constructor(data: {[key: string]: [number, number, number][]}) {
        this.loadData(data);
    }

    set current_frame(frame: number) {
        this._current_frame = frame;
    }

    get current_frame() {
        return this._current_frame;
    }


    loadData(data: {[key: string]: [number, number, number][]}) {

        if (!data || !Object.keys(data).length) {
            return;
        }

        this.data = data;
        this.total_frames = this.data[Object.keys(this.data)[0]].length;
    }

}