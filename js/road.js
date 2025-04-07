import * as THREE from '../libs/three.module.js';
import { roads } from './gameState.js';

export function generateRoads(scene, mode = 'siang') {
    const color = mode === 'malam' ? 0x111111 : 0x000000;

    for (let i = 0; i < 3; i++) {
        const road = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.1, 500),
        new THREE.MeshStandardMaterial({ color })
        );
        road.position.z = -500 * i;
        scene.add(road);
        roads.push(road);
    }
}