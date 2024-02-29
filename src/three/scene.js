import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene();
const textureCubeLoader = new THREE.CubeTextureLoader().setPath('./textures/')
const textureCube = textureCubeLoader.load([
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
])
scene.background = textureCube;
scene.environment = textureCube;

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
camera.position.set(10,10,5);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ alpha: true,antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera,renderer.domElement)
// controls.target.set(-1.7, 0.66, -4.12)

const axesHelper = new THREE.AxesHelper(25);
scene.add(axesHelper)
export {scene,camera,renderer,controls};