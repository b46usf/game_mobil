/* import { initScene } from './init.js';
import { animate } from './gameLoop.js';
import { setupInput } from './input.js';
import { playBackgroundMusic } from './sound.js'; */
import { listenOrientation } from './orientation.js';
import { setupUI } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
  listenOrientation();
  setupUI();
  /* initScene();
  setupUI();
  setupInput();
  playBackgroundMusic();
  animate(); */
});
