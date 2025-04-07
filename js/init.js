import { scene, setCamera, setRenderer, keys, level } from './gameState.js';
import * as THREE from '../libs/three.module.js';
import { spawnMixedObstacles } from './obstacle.js';
// import { generateCheckpoints } from './checkpoint.js';
// import { createScoreText } from './score.js';
import { addLighting } from './lighting.js';
import { addGround } from './ground.js';
import { generateRoads } from './road.js';
import { generateWalls } from './wall.js';
import { loadCar } from './car.js';


export function initScene() {
  // Atur background dan fog untuk scene global
  scene.background = new THREE.Color(0x202020);
  scene.fog = new THREE.Fog(0x202020, 10, 100);

  // Kamera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);
  setCamera(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('game-container').appendChild(renderer.domElement);
  setRenderer(renderer);

  const timeOfDay = new Date().getHours();
  const mode = timeOfDay >= 18 || timeOfDay < 6 ? 'malam' : 'siang';
  addLighting(scene, mode);
  addGround(scene, mode);
  generateRoads(scene, mode);
  generateWalls(scene, mode);

  loadCar(scene, mode, () => {
    // Callback setelah mobil dimuat
    console.log('Mobil siap! Game bisa dimulai atau UI bisa ditampilkan');
  });

  generateObstacles(scene, 10);
  spawnMixedObstacles(10 + level * 2);
  setupInput();
  handleResize();

  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
