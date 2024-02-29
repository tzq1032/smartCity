import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { scene } from "./scene";
import modifyCityMaterial from '@/three/modify/modifyCityMaterial';
import AlarmSprite from './mesh/AlarmSprite';
import CreateCityLine from "./mesh/cityLine";

export default function createCity(){
    const loader = new GLTFLoader();
    loader.load('./model/city.glb',(gltf)=>{
    
    gltf.scene.traverse((item)=>{
        if(item.type === 'Mesh'){
            if(item.name==='Layerbuildings'){
                const edgeMesh = new CreateCityLine(item.geometry);
                const size = item.scale.x*1.001;
                edgeMesh.mesh.scale.set(size,size,size);
                scene.add(edgeMesh.mesh);
            }
            const cityMaterial = new THREE.MeshBasicMaterial({
                color:'#0C016F'
            })
            item.material = cityMaterial;
            modifyCityMaterial(item)  
        }
    })
        scene.add(gltf.scene)  
    })
}