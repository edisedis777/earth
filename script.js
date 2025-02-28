// Scene setup
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Starfield background
const starCount = 5000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {
  const radius = 100 + Math.random() * 400;
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
  starPositions[i + 2] = radius * Math.cos(phi);
}

starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starPositions, 3)
);
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1,
  sizeAttenuation: true,
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Earth geometry and texture
const geometry = new THREE.SphereGeometry(5, 32, 32);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("./assets/3d-cute.jpg");
const material = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

// Cloud layer geometry and texture
const cloudGeometry = new THREE.SphereGeometry(5.05, 32, 32);
const cloudTexture = textureLoader.load("./assets/clouds.png");
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Atmosphere glow
const atmosphereGeometry = new THREE.SphereGeometry(5.1, 32, 32);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x00aaff,
  transparent: true,
  opacity: 0.2,
  side: THREE.BackSide,
});
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphereMesh);

// Moon (textured)
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const moonTexture = textureLoader.load(
  "./assets/moon.jpg",
  () => console.log("Moon texture loaded successfully"),
  undefined,
  (error) => console.error("Error loading moon texture:", error)
);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
let moonTheta = 0;
let moonPhi = Math.PI / 2;
const moonRadius = 7;
moon.position.set(moonRadius, 0, 0);
scene.add(moon);

// Lighting (static)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Mouse controls for Earth
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

window.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;
    earthMesh.rotation.y += deltaX * 0.005;
    earthMesh.rotation.x += deltaY * 0.005;
    earthMesh.rotation.x = Math.max(
      Math.min(earthMesh.rotation.x, Math.PI / 2),
      -Math.PI / 2
    );
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
    atmosphereMesh.rotation.copy(earthMesh.rotation);
    cloudMesh.rotation.copy(earthMesh.rotation);
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomSpeed = 0.1;
  camera.position.z += event.deltaY * zoomSpeed;
  camera.position.z = Math.max(8, Math.min(30, camera.position.z));
});

// WASD controls for moon
const keys = { w: false, a: false, s: false, d: false };
window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      keys.w = true;
      break;
    case "a":
      keys.a = true;
      break;
    case "s":
      keys.s = true;
      break;
    case "d":
      keys.d = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      keys.w = false;
      break;
    case "a":
      keys.a = false;
      break;
    case "s":
      keys.s = false;
      break;
    case "d":
      keys.d = false;
      break;
  }
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) {
    earthMesh.rotation.y += 0.005;
    atmosphereMesh.rotation.y += 0.005;
  }
  cloudMesh.rotation.y += 0.002;

  // Moon movement with WASD
  const speed = 0.02;
  if (keys.w) moonPhi -= speed;
  if (keys.s) moonPhi += speed;
  if (keys.a) moonTheta += speed;
  if (keys.d) moonTheta -= speed;

  moonPhi = Math.max(0.1, Math.min(Math.PI - 0.1, moonPhi));

  moon.position.x = moonRadius * Math.sin(moonPhi) * Math.cos(moonTheta);
  moon.position.y = moonRadius * Math.cos(moonPhi);
  moon.position.z = moonRadius * Math.sin(moonPhi) * Math.sin(moonTheta);

  // Rotate moon for visual effect
  moon.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
