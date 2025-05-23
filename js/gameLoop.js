import { car, renderer, scene, camera, roads, walls } from './gameState.js';
import { updateCarMovement } from './movement.js';
import { updateCamera } from './camera.js';
// import { updateObstacles } from './obstacle.js';

export function animate() {
  requestAnimationFrame(animate);

  if (!car) return;

  updateCarMovement();
  updateCamera();
  // updateObstacles(car);

  // Update posisi jalan dan dinding (looping terus-menerus)
  roads.forEach(road => {
    if (car.position.z - road.position.z < -500) {
      road.position.z -= 1500;
    }
  });

  /* walls.forEach(wall => {
    if (car.position.z - wall.position.z < -500) {
      wall.position.z -= 1500;
    }
  }); */
  console.log('Loading car...');
  console.log(car, scene, camera);
  renderer.render(scene, camera);
}