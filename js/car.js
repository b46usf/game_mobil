import { GLTFLoader } from '../libs/GLTFLoader.js';
import { addCarHeadlights } from './lighting.js';
// import { animate } from './gameLoop.js';

export function loadCar(scene, mode) {
  const loader = new GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    const car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);

    // Tambahkan lampu mobil jika malam
    if (mode === 'malam') {
      addCarHeadlights(car, scene);
    }

    console.log('Loading car...');
    console.log(car, gameStarted, scene, mode);
    // Jalankan callback jika sudah dimuat (misalnya mulai animasi)
    // animate();
  });
}