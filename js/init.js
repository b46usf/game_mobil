import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';
import { generateObstacles } from './obstacles.js';
import { generateCheckpoints } from './checkpoints.js';
import { createPortalGates } from './portals.js';
import { createScoreText } from './score.js';
import { animate } from './gameLoop.js';

export let scene, camera, renderer, car, roads = [], keys = {};

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game-container').appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10).normalize();
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Load 3D car model
  const loader = new GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);
  });

  // Generate roads
  for (let i = 0; i < 3; i++) {
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.1, 500),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    road.position.z = -500 * i;
    scene.add(road);
    roads.push(road);
  }

  // Generate walls
  for (let i = 0; i < 3; i++) {
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 500),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    left.position.set(-10, 0.5, -500 * i);
    scene.add(left);

    const right = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 500),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    right.position.set(10, 0.5, -500 * i);
    scene.add(right);
  }

  generateObstacles(scene);
  generateCheckpoints(scene);
  createPortalGates(scene);
  createScoreText(scene);

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
