let scene, camera, renderer, car, obstacles = [], points = [], score = 0;
let roads = [];

const keys = { ArrowLeft: false, ArrowRight: false };

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa); // background kelabu

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);
  camera.lookAt(0, 1.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("game-container").appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const loader = new THREE.GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);
  });

  // Infinite road segments
  for (let i = 0; i < 3; i++) {
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.1, 500),
      new THREE.MeshStandardMaterial({ color: 0x000000 }) // jalan hitam
    );
    road.position.z = -500 * i;
    scene.add(road);
    roads.push(road);
  }

  // Pembatas jalan kiri dan kanan
  for (let i = 0; i < 3; i++) {
    let left = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 500),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    left.position.set(-10, 0.5, -500 * i);
    scene.add(left);

    let right = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 500),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    right.position.set(10, 0.5, -500 * i);
    scene.add(right);
  }

  // Obstacle dan point
  for (let i = 0; i < 20; i++) {
    let obs = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    obs.position.set((Math.random() - 0.5) * 18, 0.5, -Math.random() * 1000);
    scene.add(obs);
    obstacles.push({ mesh: obs, direction: Math.random() > 0.5 ? 1 : -1 });

    let point = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    point.position.set((Math.random() - 0.5) * 18, 0.5, -Math.random() * 1000);
    scene.add(point);
    points.push(point);
  }

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (car) {
    if (keys.ArrowLeft && car.position.x > -9) car.position.x -= 0.2;
    if (keys.ArrowRight && car.position.x < 9) car.position.x += 0.2;

    car.position.z -= 0.5;

    camera.position.set(car.position.x, car.position.y + 5, car.position.z + 10);
    camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);

    // Infinite road movement
    roads.forEach(road => {
      if (car.position.z - road.position.z < -500) {
        road.position.z -= 1500;
      }
    });

    // Gerak naik turun obstacles
    obstacles.forEach(obj => {
      const obs = obj.mesh;
      obs.position.y += 0.02 * obj.direction;
      if (obs.position.y > 1 || obs.position.y < 0.3) obj.direction *= -1;

      if (obs.position.distanceTo(car.position) < 1) {
        alert("Kena obstacle! Game Over.\nSkor: " + score);
        window.location.reload();
      }
    });

    points.forEach((pt, i) => {
      if (pt && pt.position.distanceTo(car.position) < 1) {
        score++;
        scene.remove(pt);
        points[i] = null;
        console.log("Skor:", score);
      }
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();