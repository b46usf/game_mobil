import * as THREE from '../libs/three.module.js';

export function addGround(scene, mode = 'siang') {
  const color = mode === 'malam' ? 0x111111 : 0x222222;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);
}