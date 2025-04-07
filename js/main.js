/* 
import { animate } from './gameLoop.js';
import { setupInput } from './input.js';
import { playBackgroundMusic } from './sound.js'; */
import { listenOrientation } from './orientation.js';
import { setupUI } from './ui.js';
import { initScene } from './init.js';

window.addEventListener('DOMContentLoaded', () => {
  listenOrientation();
  setupUI();
  initScene();
  setupInput();
  /* 
  setupInput();
  playBackgroundMusic();
  animate(); */
});
