import { GLTFLoader } from '../libs/GLTFLoader.js';
import { animate } from './gameLoop.js';
import { addCarHeadlights } from './lighting.js';
import { car } from './gameState.js';

export function loadCar(scene, mode, onLoaded = () => {}) {
  const loader = new GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);

    // Tambahkan lampu mobil jika malam
    if (mode === 'malam') {
      addCarHeadlights(car, scene);
    }

    if (!gameStarted) {
        gameStarted = true;
        animate();
    }

    // Jalankan callback jika sudah dimuat (misalnya mulai animasi)
    onLoaded();
  });
}