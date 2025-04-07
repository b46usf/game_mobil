import { keys } from './gameState.js';

export function setupInput() {
  // 🎮 Keyboard input
  window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
    }
  });

  // 📱 Mobile button input
  const mappings = [
    { id: 'leftBtn', key: 'ArrowLeft' },
    { id: 'rightBtn', key: 'ArrowRight' },
    { id: 'upBtn', key: 'ArrowUp' },
    { id: 'downBtn', key: 'ArrowDown' }
  ];

  mappings.forEach(({ id, key }) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    // 📲 Touch
    btn.addEventListener('touchstart', () => keys[key] = true);
    btn.addEventListener('touchend', () => keys[key] = false);

    // 🖱️ Mouse (opsional untuk desktop)
    btn.addEventListener('mousedown', () => keys[key] = true);
    btn.addEventListener('mouseup', () => keys[key] = false);
    btn.addEventListener('mouseleave', () => keys[key] = false);
  });
}