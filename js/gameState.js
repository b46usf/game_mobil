// 🎥 Utama
export let scene;
export let camera;
export let renderer;
export let car;
export let level = 1;
export let timer = 60;
export const score = { value: 0 };

// 🎮 Input Key Map
export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

// 🧱 Objek dalam game
export const roads = [];
export const obstacles = [];
export const checkpoints = [];
export const walls = [];
export const leaderboard = [];
export const gameStarted = false;

// 🔄 Untuk update nilai global dari file lain
export function setScene(newScene) {
  scene = newScene;
}

export function setCamera(newCamera) {
  camera = newCamera;
}

export function setRenderer(newRenderer) {
  renderer = newRenderer;
}

export function setCar(newCar) {
  car = newCar;
}

export function resetGameState() {
  score = 0;
  level = 1;
  timer = 60;
  gameStarted = false;
  gameFinished = false;
}
