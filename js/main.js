import { initScene } from './init.js';
import { animate } from './gameLoop.js';
import { setupUI } from './ui.js';
import { setupInput } from './input.js';
import { playBackgroundMusic } from './sound.js';

window.addEventListener('DOMContentLoaded', () => {
  initScene();
  setupUI();
  setupInput();
  playBackgroundMusic();
  animate();
});
