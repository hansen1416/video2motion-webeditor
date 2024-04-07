import * as THREE from 'three';

export default class RotationControl {

    group: THREE.Group = new THREE.Group();

    RADIUS = 0.3;

    constructor() {
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
        const geometry = new THREE.SphereGeometry(this.RADIUS, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00, transparent: true, opacity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);

        return sphere;
    }

    createCircle(color = 0xffffff): THREE.LineLoop {

        // Create a path object
        const path = new THREE.Path();
        path.absarc(0, 0, this.RADIUS, 0, Math.PI * 2); // Full circle

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