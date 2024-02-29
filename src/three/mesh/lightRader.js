import * as THREE from 'three'
import vertex from '@/shader/lightRader/Vertex.glsl';
import fragment from '@/shader/lightRader/Fragment.glsl';
import gsap from "gsap";

export default class LightRader{
    constructor(position={x:0,z:0}){
      const geometry = new THREE.PlaneGeometry(2,2);
      const material = new THREE.ShaderMaterial({
        uniforms:{
            uTime:{
                value:0
            },
            uColor:{
                value:new THREE.Color('red')
            }
        },
        transparent:true,
        side:THREE.DoubleSide,
        vertexShader:vertex,
        fragmentShader:fragment,

      })  
      const lightRader = new THREE.Mesh(geometry,material);
      this.mesh = lightRader;
      this.mesh.position.set(position.x,1.5,position.z);
      this.mesh.rotation.x = - Math.PI/2;

      gsap.to(material.uniforms.uTime,{
        value:1,
        duration:10,
        repeat:-1,
      })
    }
}