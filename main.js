let scene, camera, renderer, car, score = 0, speed = 0.5;
let obstacles = [], points = [], roads = [], checkpoints = [];
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

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
  }

  for (let i = 0; i < 3; i++) {
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 500), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    left.position.set(-10, 0.5, -500 * i);
    scene.add(left);

    const right = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 500), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    right.position.set(10, 0.5, -500 * i);
    scene.add(right);
  }

  generateObstacles();
  generateCheckpoints();
  createPortalGates();
  createScoreText();

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  animate();
}

function createPortalGates() {
  const createGate = (z, text) => {
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(12, 4, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    arch.position.set(0, 2, z);
    scene.add(arch);

    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', font => {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 1,
        height: 0.2,
      });
      const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-4, 4, z);
      scene.add(mesh);
    });
  };

  createGate(0, 'START');
  createGate(-5000, 'FINISH');
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

function createScoreText() {
  const div = document.createElement('div');
  div.id = 'score';
  div.style.position = 'absolute';
  div.style.top = '10px';
  div.style.left = '10px';
  div.style.color = 'white';
  div.style.fontSize = '24px';
  div.innerText = 'Score: 0';
  document.body.appendChild(div);

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