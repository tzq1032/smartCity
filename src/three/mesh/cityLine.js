
import * as THREE from 'three';
export default class CreateCityLine{
    constructor(geometry){
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({color:0xffffff});
        const line = new THREE.LineSegments(edges,material);
        this.geometry = line;
        this.mesh = line;
    }
}