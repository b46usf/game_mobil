let scene, camera, renderer, car, obstacles = [], points = [], score = 0;

const keys = { ArrowLeft: false, ArrowRight: false };

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
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

  // Gunakan GLTFLoader untuk load .glb
  const loader = new THREE.GLTFLoader();
  loader.load('model/Turbo_Star_Car.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.rotation.y = Math.PI;
    car.position.set(0, 1, 0);
    scene.add(car);
  });

  const road = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.1, 500),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  road.position.z = 250;
  scene.add(road);

  // Tambah obstacle dan point
  for (let i = 0; i < 10; i++) {
    let obs = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    obs.position.set((Math.random() - 0.5) * 10, 0.5, Math.random() * 400 + 50);
    scene.add(obs);
    obstacles.push(obs);

    let point = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    point.position.set((Math.random() - 0.5) * 10, 0.5, Math.random() * 400 + 50);
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
    if (keys.ArrowLeft) car.position.x -= 0.2;
    if (keys.ArrowRight) car.position.x += 0.2;

    car.position.z += 0.5;

    camera.position.set(car.position.x, car.position.y + 5, car.position.z + 10);
    camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);

    obstacles.forEach(obs => {
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
