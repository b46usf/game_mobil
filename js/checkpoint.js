import * as THREE from '../libs/three.module.js';
import { checkpoints } from './gameState.js';

export function generateCheckpoints(scene) {
  for (let i = 1; i <= 5; i++) {
    const cp = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.5, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    cp.position.set(0, 0.25, -i * 200);
    scene.add(cp);
    checkpoints.push(cp);
  }
}
