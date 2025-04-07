import { camera, car } from './gameState.js';

const followOffset = { x: 0, y: 5, z: 10 };
const smoothFactor = 0.05; // Semakin kecil, semakin lambat gerak kameranya

export function updateCamera() {
  if (!car) return;

  const targetX = car.position.x + followOffset.x;
  const targetY = car.position.y + followOffset.y;
  const targetZ = car.position.z + followOffset.z;

  // Interpolasi posisi kamera agar halus (smooth follow)
  camera.position.x += (targetX - camera.position.x) * smoothFactor;
  camera.position.y += (targetY - camera.position.y) * smoothFactor;
  camera.position.z += (targetZ - camera.position.z) * smoothFactor;

  // Kamera selalu menghadap ke arah mobil
  camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);
}