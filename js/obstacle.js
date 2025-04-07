// Obstacles.js
import * as THREE from '../libs/three.module.js';
import { scene, obstacles, score } from './gameState.js';

export function createObstacle(type) {
  let geometry, material;
  if (type === 'red') {
    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  } else {
    geometry = new THREE.SphereGeometry(1.2, 16, 16);
    material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  }

  const obs = new THREE.Mesh(geometry, material);
  obs.position.set(
    (Math.random() - 0.5) * 18,
    1,
    -Math.random() * 800 - 400
  );
  obs.userData = {
    direction: Math.random() > 0.5 ? 1 : -1,
    type,
    touched: false
  };

  scene.add(obs);
  obstacles.push(obs);
}

export function spawnMixedObstacles(num = 10) {
  for (let i = 0; i < num; i++) {
    const type = Math.random() > 0.5 ? 'red' : 'yellow';
    createObstacle(type);
  }
}

export function updateObstacles(car) {
  obstacles.forEach(obs => {
    // Gerakan horizontal
    obs.position.x += obs.userData.direction * 0.05;
    if (Math.abs(obs.position.x) > 9) {
      obs.userData.direction *= -1;
    }

    // Loop ke depan jika sudah terlalu jauh di belakang
    if (car.position.z - obs.position.z < -100) {
      obs.position.z = car.position.z - 600 - Math.random() * 400;
      obs.position.x = (Math.random() - 0.5) * 18;
      obs.userData.touched = false;
    }

    // Deteksi tabrakan
    const dx = car.position.x - obs.position.x;
    const dz = car.position.z - obs.position.z;
    if (!obs.userData.touched && Math.abs(dx) < 2 && Math.abs(dz) < 2) {
      obs.userData.touched = true;
      if (obs.userData.type === 'red') {
        score.value -= 1;
      } else if (obs.userData.type === 'yellow') {
        score.value += 1;
      }
    }
  });
}