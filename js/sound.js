let bgm;

export function playBackgroundMusic() {
  bgm = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_65f85f1df0.mp3');
  bgm.loop = true;
  bgm.volume = 0.5;
  bgm.play().catch(e => console.log('Autoplay prevented'));
}
