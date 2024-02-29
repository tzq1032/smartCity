<template>
  <div class="home">
   <Scene :eventList="eventList"></Scene>
   <BigScreen :dataInfo="dataInfo" :eventList="eventList"></BigScreen>
  </div>
</template>

<script setup>
// @ is an alias to /src
import Scene from '@/components/Scene.vue';
import BigScreen from '@/components/BigScreen.vue'
import { ref, reactive } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { getSmartCityInfo,getSmartCityEventList } from '@/api/api';
import gsap from 'gsap';

//响应式对象
const dataInfo = reactive({
  iot:{number:0},
  event:{number:0},
  power:{number:0},
  test:{number:0}
})
const eventList = ref([]);
const changeEventList = async()=>{
  let resEventList = await getSmartCityEventList();
  // console.log(resEventList);
 eventList.value = resEventList.data.list;
}

const changeInfo = async()=>{
  let res = await getSmartCityInfo();
  // console.log(res);
  for (const key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name;
    dataInfo[key].unit = res.data.data[key].unit;
    gsap.to(dataInfo[key],{
      number:res.data.data[key].number,
      duration:2,
    })
  }

}
onMounted(async()=>{
  changeInfo();
  changeEventList();

  setInterval(() => {
    changeInfo();
  changeEventList();
  }, 5000);
})
</script>
