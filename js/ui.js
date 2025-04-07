export function setupUI() {
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', () => {
    // Sembunyikan main menu
    document.getElementById('mainMenu').style.display = 'none';

    // Tampilkan elemen UI
    document.getElementById('score')?.classList.remove('hidden');
    document.getElementById('timer')?.classList.remove('hidden');
    document.getElementById('endUI')?.classList.remove('hidden'); // Jika memang dipakai
    document.getElementById('fireworks')?.classList.remove('hidden');

    // Tampilkan mobile controls jika dalam mode mobile landscape
    if (window.innerWidth <= 768 && window.matchMedia('(orientation: landscape)').matches) {
      document.getElementById('mobile-controls-left')?.classList.remove('hidden');
      document.getElementById('mobile-controls-right')?.classList.remove('hidden');
    }

    // Pastikan canvas game tampil
    document.getElementById('game-container')?.classList.remove('hidden');
  });
}
