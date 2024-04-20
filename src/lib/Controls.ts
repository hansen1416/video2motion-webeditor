import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';



abstract class BaseControl {

    group: THREE.Group = new THREE.Group();

    bone: THREE.Object3D | null = null;

    constructor() {

        this.hide();
    }

    hide() {
        this.group.position.set(-1000, -1000, -1000);
        this.group.visible = false;
    }

    show() {
        if (this.bone) {
            this.group.visible = true;
        }
    }

    setBone(bone: THREE.Object3D) {
        this.bone = bone;

        this.update();
    }

    update() {
        if (this.bone) {
            this.group.position.copy(this.bone.getWorldPosition(new THREE.Vector3()));
            this.group.rotation.copy(this.bone.rotation);
        }
    }
}

function samplePointsOnCircle(radius: number, numPoints: number) {
    const points = [];
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, 0)); // Adjust z-coordinate if needed
    }

    points.push(points[0]); // Close the circle

    return points;
}

export class RotationControl extends BaseControl {

    radius: number = 0.2

    constructor() {

        super();

        this.init();
    }

    init() {

        const xaxis = this._circle(0xff0000, "xrotation");
        xaxis.rotation.y = Math.PI / 2;

        const yaxis = this._circle(0x00ff00, "yrotation");
        yaxis.rotation.x = Math.PI / 2;

        const zaxis = this._circle(0x0000ff, "zrotation");
        zaxis.rotation.z = Math.PI / 2;

        this.group.add(xaxis);
        this.group.add(yaxis);
        this.group.add(zaxis);
    }


    /**
     * 
     * @param color 
     * @returns 
     */
    _circle(color: number, name = ""): Line2 {

        // get points from a circle
        const points = samplePointsOnCircle(this.radius, 100);
        const positions: Array<number> = []

        for (let i = 0; i < points.length; i++) {
            positions.push(points[i].x, points[i].y, points[i].z);
        }


        const geometry = new LineGeometry();
        geometry.setPositions(positions);

        const matLine = new LineMaterial({

            color: color,
            linewidth: 0.005, // in world units with size attenuation, pixels otherwise
            // vertexColors: true,

            //resolution:  // to be set by renderer, eventually
            dashed: false,
            alphaToCoverage: true,
        });

        const line = new Line2(geometry, matLine);
        line.computeLineDistances();
        line.name = name;

        return line;

    }
}

export class TranslationControl extends BaseControl {

    size: number = 0.3

    constructor() {

        super();

        this.init();
    }

    init() {
        const xaxis = this._axis(new THREE.Vector3(1, 0, 0), 0xff0000, "xaxis");
        const yaxis = this._axis(new THREE.Vector3(0, 1, 0), 0x00ff00, "yaxis");
        const zaxis = this._axis(new THREE.Vector3(0, 0, 1), 0x0000ff, "zaxis");

        this.group.add(xaxis);
        this.group.add(yaxis);
        this.group.add(zaxis);
    }

    _axis(dir = new THREE.Vector3(1, 0, 0), color = 0xff0000, name = "") {
        const axis = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), this.size, color, 0.05, 0.05);
        axis.name = name;

        return axis;
    }
}