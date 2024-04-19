import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

const RADIUS = 0.3;

abstract class BaseControl {

    group: THREE.Group = new THREE.Group();

    constructor() {

        this.hide();
    }

    hide() {
        this.group.position.set(0.3, 0.3, 0.3);
    }

    show(position: THREE.Vector3) {
        this.group.position.copy(position);
    }
}

export class RotationControl extends BaseControl {

    constructor() {

        super();

        this.init();
    }

    init() {

        const xaxis = this.createCircle(0xff0000);
        // xaxis.rotation.y = Math.PI / 2;

        const yaxis = this.createCircle(0x00ff00);
        // yaxis.rotation.x = Math.PI / 2;

        const zaxis = this.createCircle(0x0000ff);
        // zaxis.rotation.z = Math.PI / 2;

        this.group.add(xaxis);
        this.group.add(yaxis);
        this.group.add(zaxis);
    }


    /**
     * 
     * @param color 
     * @returns 
     */
    createCircle(color: number): Line2 {


        const positions = [0, 0, 0, 0.1, 0.1, 0.1]


        const geometry = new LineGeometry();
        geometry.setPositions(positions);

        const matLine = new LineMaterial({

            color: 0xffffff,
            linewidth: 0.01, // in world units with size attenuation, pixels otherwise
            vertexColors: true,

            //resolution:  // to be set by renderer, eventually
            dashed: false,
            alphaToCoverage: true,

        });

        const line = new Line2(geometry, matLine);
        line.computeLineDistances();

        return line;

    }
}

export class TranslationControl extends BaseControl {
    constructor() {

        super();

        this.init();
    }

    init() {
        const xaxis = this._axis(new THREE.Vector3(1, 0, 0), 0xff0000);
        const yaxis = this._axis(new THREE.Vector3(0, 1, 0), 0x00ff00);
        const zaxis = this._axis(new THREE.Vector3(0, 0, 1), 0x0000ff);

        this.group.add(xaxis);
        this.group.add(yaxis);
        this.group.add(zaxis);
    }

    _axis(dir = new THREE.Vector3(1, 0, 0), color = 0xff0000) {
        return new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), RADIUS, color);
    }
}