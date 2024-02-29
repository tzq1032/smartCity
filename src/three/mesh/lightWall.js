import * as THREE from "three";
import vertex from '@/shader/lightWall/Vertex.glsl';
import fragment from '@/shader/lightWall/Fragment.glsl';
import gsap from "gsap";

export default class LightWall{
    constructor(position={x:0,z:0}){
        const color = new THREE.Color(Math.random(),Math.random(),Math.random())
        const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 1, 32,1,true );
        const material = new THREE.ShaderMaterial({
            vertexShader:vertex,
            fragmentShader:fragment,
            transparent:true, 
            side:THREE.DoubleSide,
        });
        const cylinder = new THREE.Mesh( geometry, material );
        this.mesh = cylinder;
        this.mesh.position.set(position.x,1.5,position.z);
        this.mesh.geometry.computeBoundingBox();
        let {min,max} = this.mesh.geometry.boundingBox;
        let uHeight = max.y-min.y;
        this.mesh.material.uniforms.uHeight = {
            value:uHeight,
        };
        gsap.to(this.mesh.scale,{
            x:0.7,
            z:0.7,
            duration:3,
            repeat:-1,
            yoyo:true,
        })
    }
} 