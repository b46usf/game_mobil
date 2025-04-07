import * as THREE from '../libs/three.module.js';
import { walls } from './gameState.js';

export function generateWalls(scene,  mode = 'siang') {
    const color = mode === 'malam' ? 0x222222 : 0x444444;

    for (let i = 0; i < 3; i++) {
        const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 5, 500),
        new THREE.MeshStandardMaterial({ color })
        );
        leftWall.position.set(-10.5, 2.5, -500 * i);
        scene.add(leftWall);
        walls.push(leftWall);

        const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 5, 500),
        new THREE.MeshStandardMaterial({ color })
        );
        rightWall.position.set(10.5, 2.5, -500 * i);
        scene.add(rightWall);
        walls.push(rightWall);
    }
}