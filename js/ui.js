export function setupUI() {
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', () => {
    // Sembunyikan main menu
    document.getElementById('mainMenu').style.display = 'none';

    // Tampilkan elemen UI
    document.getElementById('score')?.classList.remove('hidden');
    document.getElementById('timer')?.classList.remove('hidden');
    document.getElementById('endUI')?.classList.remove('hidden');
    document.getElementById('fireworks')?.classList.remove('hidden');
    document.getElementById('game-container')?.classList.remove('hidden');

    // Tampilkan mobile controls jika mobile landscape
    const isMobileLandscape = window.innerWidth <= 768 && window.matchMedia('(orientation: landscape)').matches;
    if (isMobileLandscape) {
      document.getElementById('mobile-controls-left')?.classList.add('show-controls');
      document.getElementById('mobile-controls-right')?.classList.add('show-controls');
    }
  });
}