/* import { initScene } from './init.js';
import { animate } from './gameLoop.js';
import { setupUI } from './ui.js';
import { setupInput } from './input.js';
import { playBackgroundMusic } from './sound.js'; */
import { listenOrientation } from './orientation.js';

window.addEventListener('DOMContentLoaded', () => {
  listenOrientation();
  /* initScene();
  setupUI();
  setupInput();
  playBackgroundMusic();
  animate(); */
});
