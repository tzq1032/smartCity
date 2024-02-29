import {scene,renderer,camera,controls} from './scene.js'
function animate() {
    controls.update()
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  export default animate;