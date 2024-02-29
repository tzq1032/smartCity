import * as THREE from 'three'
import { TextureLoader } from 'three'
import { camera } from '../scene';

export default class AlarmSprite{
    constructor(type='fire',position={x:-1.8,z:3},color=0xffffff){
        const textureLoader = new TextureLoader();
        const typeObj = {
            火警:'./textures/tag/fire.png',
            电力:'./textures/tag/e.png',
            治安:'./textures/tag/jingcha.png'
        }
        const texture = textureLoader.load(typeObj[type])
        this.material = new THREE.SpriteMaterial({
            map:texture,
            color:color,
            transparent:true,
            depthTest:false,
        });
        this.mesh = new THREE.Sprite(this.material);
        this.mesh.position.set(position.x,3.5,position.z);
        
        //添加点击事件
        this.fns = [];
        this.onClick = function(fn){
            this.fns.push(fn);
         }
        this.rayCaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        window.addEventListener('click',(e)=>{
            this.mouse.x = (e.clientX/window.innerWidth)*2-1;
            this.mouse.y = -((e.clientY/window.innerHeight)*2-1);
            this.rayCaster.setFromCamera(this.mouse,camera);
            const intersects = this.rayCaster.intersectObject(this.mesh);
            if(intersects.length>0){
                this.fns.forEach(fn => {
                    fn();
                });
            }
        })
    }
}

