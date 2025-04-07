import { scene, camera, renderer, car } from './init.js';

let speed = 0.1;

export function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

function update() {
  car.position.z += speed;
  camera.position.z = car.position.z - 10;
  camera.position.x = car.position.x;
  camera.lookAt(car.position);
}
