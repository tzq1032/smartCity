<template>
  <div class="scene" ref="sceneDiv"></div>
</template>
<script setup>
import { onMounted,ref,watch } from 'vue';
import * as THREE from "three";
import {scene,camera,renderer,controls} from '../three/scene.js'
import '@/three/init'
import animate from '@/three/animate'
import createCity from '@/three/createCity'
import ambientLight from '@/three/light'
import FlyLine from '@/three/mesh/flyLine';
import AlarmSprite from '../three/mesh/AlarmSprite';
import LightWall from '@/three/mesh/lightWall';
import LightRader from '@/three/mesh/lightRader'
import FlyLineShader from '@/three/mesh/flyLineShader'
import eventHub from '@/utils/eventHub'
import gsap from 'gsap';

const sceneDiv = ref(null);
const flyLine = new FlyLine();
// defineProps是Vue3中的一种新的组件数据传递方式，可以用于在子组件中定义接收哪些父组件的props。
// 当父组件的props发生变化时，子组件也会随之响应。
const props = defineProps(['eventList'])
scene.add(ambientLight);
scene.add(flyLine.mesh);
const alarmListArr = [];
let mapFn = {
  火警:(position,i)=>{
    const lightWallMesh = new LightWall(position);
    lightWallMesh.mesh.eventListIndex = i;
    scene.add(lightWallMesh.mesh);
    alarmListArr.push(lightWallMesh.mesh);
  },
  电力:(position,i)=>{
    const lightRaderMesh = new LightRader(position);
    lightRaderMesh.mesh.eventListIndex = i;
    scene.add(lightRaderMesh.mesh);
    alarmListArr.push(lightRaderMesh.mesh);
  },
  治安:(position,i)=>{
    const flyLineShader = new FlyLineShader(position);
    flyLineShader.mesh.eventListIndex = i;
    scene.add(flyLineShader.mesh);
    alarmListArr.push(flyLineShader.mesh);
  }
}
eventHub.on('x',(i)=>{
  alarmListArr.forEach(item => {
    if(item.eventListIndex !==i){
      item.visible = false;
    }else{
      item.visible = true;
    }
  });
  const position = {
    x:props.eventList[i].position.x/5-10,
    y:0,
    z:props.eventList[i].position.y/5-10
  }
  gsap.to(controls.target,{
    x:position.x,
    y:position.y,
    z:position.z,
    duration:2,
  });
})
//创建mesh
createCity();
onMounted(()=>{
    sceneDiv.value.appendChild(renderer.domElement);
    animate();
})
watch(
  ()=>{
    return props.eventList;
  },
  (value)=>{
    alarmListArr.forEach(ele => {
        scene.remove(ele);
      });
    props.eventList.forEach((element,i) => {
      const position = {
        x:element.position.x/5-10,
        z:element.position.y/5-10
      }
      const alarmTag = new AlarmSprite(element.name,position);
      alarmTag.mesh.eventListIndex = i;
      alarmTag.onClick(()=>{
        eventHub.emit('spriteClick',{element,i})
      }
      )
      alarmListArr.push(alarmTag.mesh);
      scene.add(alarmTag.mesh);
      if(mapFn[element.name]){
        mapFn[element.name](position,i);
      }
    });
  },
)
</script>

<style>
.scene{
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index:100;
    left: 0;
    top: 0;
}
</style>