import * as THREE from '../libs/three.module.js';

export function addLighting(scene, mode = 'siang') {
  // Hapus semua lampu sebelumnya
  const oldLights = scene.children.filter(obj => obj.isLight);
  oldLights.forEach(light => scene.remove(light));

  // Tambahkan pencahayaan berdasarkan mode
  if (mode === 'malam') {
    const ambient = new THREE.AmbientLight(0x222244, 0.5); // lebih gelap
    const directional = new THREE.DirectionalLight(0xccccff, 0.6);
    directional.position.set(0, 10, 10);
    scene.add(ambient);
    scene.add(directional);
  } else {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(0, 10, 10);
    scene.add(ambient);
    scene.add(directional);
  }
}

export function addCarHeadlights(car, mode = 'siang') {
  const existingLights = car.children.filter(obj => obj.name === 'headlight_left' || obj.name === 'headlight_right');
  existingLights.forEach(light => car.remove(light));

  if (mode === 'malam') {
    const headlightLeft = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 8, 0.5);
    headlightLeft.name = 'headlight_left';
    headlightLeft.position.set(-0.6, 1.2, 1);
    headlightLeft.target.position.set(-0.6, 1, 3);
    car.add(headlightLeft);
    car.add(headlightLeft.target);

    const headlightRight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 8, 0.5);
    headlightRight.name = 'headlight_right';
    headlightRight.position.set(0.6, 1.2, 1);
    headlightRight.target.position.set(0.6, 1, 3);
    car.add(headlightRight);
    car.add(headlightRight.target);
  }
}