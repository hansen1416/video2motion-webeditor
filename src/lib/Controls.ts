import * as THREE from 'three';

const RADIUS = 0.3;

abstract class BaseControl {

    group: THREE.Group = new THREE.Group();

    constructor() {

        this.hide();
    }

    hide() {
        this.group.position.set(-1000, -1000, -1000);
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
        this.group.add(this.createSphere());

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
     * create a sphere
     * @returns 
     */
    createSphere(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00, transparent: true, opacity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);

        return sphere;
    }

    createCircle(color = 0xffffff): THREE.LineLoop {

        // Create a path object
        const path = new THREE.Path();
        path.absarc(0, 0, RADIUS, 0, Math.PI * 2); // Full circle

        // Set the number of points for the line (more points, smoother circle)
        const points = path.getPoints(64);

        // Create a BufferGeometry from the points
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create a material for the line (adjust color as needed)
        const material = new THREE.LineBasicMaterial({ color: color });

        // Create the line object
        return new THREE.LineLoop(lineGeometry, material);
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