import { car } from './init.js';

export function setupInput() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') car.position.x -= 0.5;
    if (e.key === 'ArrowRight') car.position.x += 0.5;
  });

  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('touchstart', () => car.position.x -= 0.5);
    rightBtn.addEventListener('touchstart', () => car.position.x += 0.5);
  }
}
