let scene, camera, renderer, car, score = 0, speed = 0.5;
let obstacles = [], points = [], roads = [], checkpoints = [], walls = [];
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
let gameFinished = false, gameStarted = false, level = 1;
let timer = 60;
let leaderboard = [];

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);
  camera.lookAt(0, 1.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("game-container").appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const loader = new THREE.GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);
  });

  for (let i = 0; i < 3; i++) {
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.1, 500),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    road.position.z = -500 * i;
    scene.add(road);
    roads.push(road);

    const left = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 500), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    left.position.set(-10, 0.5, -500 * i);
    scene.add(left);
    walls.push(left);

    const right = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 500), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    right.position.set(10, 0.5, -500 * i);
    scene.add(right);
    walls.push(right);
  }

  generateObstacles();
  generateCheckpoints();
  createStartFinishLine();
  createUI();

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (!gameStarted) startGame();
  });
  window.addEventListener('keyup', e => keys[e.key] = false);

  animate();
}

function createUI() {
  const scoreDiv = document.createElement('div');
  scoreDiv.id = 'score';
  scoreDiv.style.position = 'absolute';
  scoreDiv.style.top = '10px';
  scoreDiv.style.left = '10px';
  scoreDiv.style.color = 'white';
  scoreDiv.style.fontSize = '24px';
  scoreDiv.innerText = 'Score: 0';
  document.body.appendChild(scoreDiv);

  const checkpointText = document.createElement('div');
  checkpointText.id = 'checkpointText';
  checkpointText.style.position = 'absolute';
  checkpointText.style.top = '50%';
  checkpointText.style.left = '50%';
  checkpointText.style.transform = 'translate(-50%, -50%)';
  checkpointText.style.fontSize = '48px';
  checkpointText.style.color = '#00ff00';
  checkpointText.style.display = 'none';
  checkpointText.style.fontWeight = 'bold';
  checkpointText.innerText = 'Checkpoint!';
  document.body.appendChild(checkpointText);

  const timerDiv = document.createElement('div');
  timerDiv.id = 'timer';
  timerDiv.style.position = 'absolute';
  timerDiv.style.top = '10px';
  timerDiv.style.right = '10px';
  timerDiv.style.color = 'white';
  timerDiv.style.fontSize = '24px';
  timerDiv.innerText = 'Time: 60';
  document.body.appendChild(timerDiv);

  const endDiv = document.createElement('div');
  endDiv.id = 'endUI';
  endDiv.style.position = 'absolute';
  endDiv.style.top = '40%';
  endDiv.style.left = '50%';
  endDiv.style.transform = 'translate(-50%, -50%)';
  endDiv.style.fontSize = '36px';
  endDiv.style.color = 'white';
  endDiv.style.display = 'none';
  endDiv.style.textAlign = 'center';
  document.body.appendChild(endDiv);

  const fireworksCanvas = document.createElement('canvas');
  fireworksCanvas.id = 'fireworks';
  fireworksCanvas.style.position = 'absolute';
  fireworksCanvas.style.top = '0';
  fireworksCanvas.style.left = '0';
  fireworksCanvas.style.width = '100%';
  fireworksCanvas.style.height = '100%';
  fireworksCanvas.style.pointerEvents = 'none';
  document.body.appendChild(fireworksCanvas);
}

function startGame() {
  gameStarted = true;
  const countdown = setInterval(() => {
    if (!gameFinished) {
      timer--;
      document.getElementById("timer").innerText = `Time: ${timer}`;
      if (timer <= 0) {
        clearInterval(countdown);
        endGame();
      }
    }
  }, 1000);
}

function endGame() {
  gameFinished = true;
  const endUI = document.getElementById('endUI');
  endUI.innerHTML = `Game Over<br>Score: ${score}`;
  endUI.style.display = 'block';
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  if (leaderboard.length > 5) leaderboard = leaderboard.slice(0, 5);
  endUI.innerHTML += `<br><br>Leaderboard:<br>${leaderboard.map((s, i) => `${i + 1}. ${s}`).join('<br>')}`;
  endUI.innerHTML += `<br><br><button onclick="location.reload()">Restart</button>`;

  startFireworks();
}

function startFireworks() {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  function createParticle(x, y) {
    for (let i = 0; i < 100; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        radius: Math.random() * 3 + 2,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= p.decay;
      if (p.alpha <= 0) particles.splice(i, 1);
    });

    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (particles.length > 0) requestAnimationFrame(animateParticles);
  }

  createParticle(canvas.width / 2, canvas.height / 2);
  animateParticles();
}

function generateCheckpoints() {
  for (let i = 1; i <= 4; i++) {
    const checkpoint = new THREE.Mesh(
      new THREE.TorusGeometry(4, 0.2, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    checkpoint.rotation.x = Math.PI / 2;
    checkpoint.position.set(0, 1.5, -1000 * i);
    checkpoint.name = 'checkpoint';
    scene.add(checkpoint);
    checkpoints.push(checkpoint);
  }
}

function showCheckpointText() {
  const text = document.getElementById('checkpointText');
  text.style.display = 'block';
  setTimeout(() => text.style.display = 'none', 1500);
}

function playCheckpointSound() {
  const audio = new Audio('audio/point-smooth-beep.mp3');
  audio.play();
}

function triggerParticles(position) {
  for (let i = 0; i < 30; i++) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    particle.position.copy(position);
    const speed = {
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2,
    };
    scene.add(particle);

    const interval = setInterval(() => {
      particle.position.x += speed.x;
      particle.position.y += speed.y;
      particle.position.z += speed.z;
      particle.material.opacity -= 0.02;
      if (particle.material.opacity <= 0) {
        scene.remove(particle);
        clearInterval(interval);
      }
    }, 16);
  }
}

function generateObstacles() {
  for (let i = 0; i < 30; i++) {
    let red = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    red.position.set((Math.random() - 0.5) * 18, 0.5, car ? car.position.z - 100 - Math.random() * 500 : -Math.random() * 3000);
    scene.add(red);
    obstacles.push({ mesh: red, direction: Math.random() > 0.5 ? 1 : -1, type: 'bad' });

    let yellow = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
    yellow.position.set((Math.random() - 0.5) * 18, 0.5, car ? car.position.z - 100 - Math.random() * 500 : -Math.random() * 3000);
    scene.add(yellow);
    obstacles.push({ mesh: yellow, direction: Math.random() > 0.5 ? 1 : -1, type: 'good' });
  }
}

function updateScoreDisplay() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

function animate() {
  requestAnimationFrame(animate);

  if (!car) return;

  if (keys.ArrowLeft && car.position.x > -9) car.position.x -= 0.2;
  if (keys.ArrowRight && car.position.x < 9) car.position.x += 0.2;
  if (keys.ArrowUp) speed = Math.min(speed + 0.01, 1.5);
  if (keys.ArrowDown) speed = Math.max(speed - 0.02, 0.1);

  car.position.z -= speed;
  camera.position.set(car.position.x, car.position.y + 5, car.position.z + 10);
  camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);

  roads.forEach(road => {
    if (car.position.z - road.position.z < -500) {
      road.position.z -= 1500;
    }
  });

  obstacles.forEach((obj, i) => {
    const mesh = obj.mesh;
    mesh.position.y += 0.02 * obj.direction;
    if (mesh.position.y > 1 || mesh.position.y < 0.3) obj.direction *= -1;

    if (mesh.position.distanceTo(car.position) < 1) {
      if (obj.type === 'good') {
        score += 1;
        scene.remove(mesh);
        obstacles[i] = null;
      } else if (obj.type === 'bad') {
        score = Math.max(0, score - 1);
        scene.remove(mesh);
        obstacles[i] = null;
      }
      updateScoreDisplay();
    }
  });

  obstacles = obstacles.filter(o => o);
  if (obstacles.length < 20) generateObstacles();

  checkpoints.forEach((cp, i) => {
    if (cp && car.position.distanceTo(cp.position) < 3) {
      showCheckpointText();
      playCheckpointSound();
      triggerParticles(cp.position);
      scene.remove(cp);
      checkpoints[i] = null;
    }
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();