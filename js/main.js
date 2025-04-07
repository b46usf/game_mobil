import { listenOrientation } from './orientation.js';
import { setupUI } from './ui.js';
// import { initScene } from './init.js';

window.addEventListener('DOMContentLoaded', () => {
  listenOrientation();
  setupUI();
  // initScene();
});
