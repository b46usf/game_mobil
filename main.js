let scene, camera, renderer, car, score = 0, speed = 0.5;
let obstacles = [], roads = [];
const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
const trackLength = 5000;

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

  // Jalan dan pembatas
  const segmentCount = Math.ceil(trackLength / 500);
  for (let i = 0; i < segmentCount; i++) {
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

    const right = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 500), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    right.position.set(10, 0.5, -500 * i);
    scene.add(right);
  }

  createGate(0, "START", 0x00ff00);
  createGate(-trackLength, "FINISH", 0xffd700);

  generateObstacles();

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  animate();
}

function createGate(zPos, label, color) {
  const gateGroup = new THREE.Group();

  const pillarMaterial = new THREE.MeshStandardMaterial({ color });
  const topMaterial = new THREE.MeshStandardMaterial({ color });

  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 0.5), pillarMaterial);
  leftPillar.position.set(-5, 2, zPos);
  gateGroup.add(leftPillar);

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 0.5), pillarMaterial);
  rightPillar.position.set(5, 2, zPos);
  gateGroup.add(rightPillar);

  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1, 0.5), topMaterial);
  topBeam.position.set(0, 4.5, zPos);
  gateGroup.add(topBeam);

  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    const textGeo = new THREE.TextGeometry(label, {
      font: font,
      size: 0.8,
      height: 0.2,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.set(-3.5, 4.2, zPos + 0.3);
    gateGroup.add(textMesh);
  });

  scene.add(gateGroup);
}

function generateObstacles() {
  const count = 100; // banyak obstacle
  for (let i = 0; i < count; i++) {
    const zBase = -Math.random() * trackLength;
    const x = (Math.random() - 0.5) * 18;
    const dir = Math.random() > 0.5 ? 1 : -1;

    const isGood = Math.random() < 0.4;
    const mesh = isGood
      ? new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0xffff00 }))
      : new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));

    mesh.position.set(x, 0.5, zBase);
    scene.add(mesh);
    obstacles.push({ mesh, direction: dir, type: isGood ? 'good' : 'bad' });
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
  if (keys.ArrowUp) speed = Math.min(speed + 0.01, 2);
  if (keys.ArrowDown) speed = Math.max(speed - 0.02, 0.05);

  car.position.z -= speed;
  camera.position.set(car.position.x, car.position.y + 5, car.position.z + 10);
  camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);

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

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
