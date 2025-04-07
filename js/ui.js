export function setupUI() {
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    document.getElementById('mainMenu').style.display = 'none';
  });
}
