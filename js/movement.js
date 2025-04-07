import { car, keys } from './gameState.js';

let speed = 1;
const maxSpeed = 2;
const minSpeed = 0.5;
const baseSpeed = 0.5;
const acceleration = 0.2;
const deceleration = 0.05;
const brakingPower = 0.05;
const friction = 0.05;
const strafeBase = 0.2;
const turnMultiplierWhenBraking = 1.5; // Belok lebih tajam saat ngerem
const slowZoneZ = [-300, -200]; // Zona rintangan yang bikin lambat
const slowZoneSpeedLimit = 0.5;

export function updateCarMovement() {
  // 🔼 Akselerasi
  if (keys.ArrowUp) {
    speed = Math.min(speed + acceleration, maxSpeed);
  }
  // 🔽 Rem
  else if (keys.ArrowDown) {
    speed = Math.max(speed - brakingPower, minSpeed);
  }
  // ⛔️ Lepas gas
  else if (speed > baseSpeed) {
    speed = Math.max(speed - deceleration, baseSpeed);
  }
  // 🧊 Friction
  else if (speed < baseSpeed) {
    speed = Math.min(speed + friction, baseSpeed);
  }

  // 🧠 Zona lambat
  if (car.position.z < slowZoneZ[0] && car.position.z > slowZoneZ[1]) {
    speed = Math.min(speed, slowZoneSpeedLimit);
  }

  // ➡️⬅️ Belok
  let strafe = strafeBase;
  if (keys.ArrowDown) strafe *= turnMultiplierWhenBraking;

  if (keys.ArrowLeft) car.position.x -= strafe;
  if (keys.ArrowRight) car.position.x += strafe;

  // 🚗 Maju
  car.position.z -= speed;

  // 🚧 Batas X
  car.position.x = Math.max(-9, Math.min(9, car.position.x));
}

export function resetSpeed() {
  speed = baseSpeed;
}
