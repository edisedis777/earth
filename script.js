// script.js
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

// Touch/Mouse controls for Earth
let isDragging = false;
let previousX = 0;
let previousY = 0;

function startInteraction(event) {
  isDragging = true;
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  previousX = clientX;
  previousY = clientY;
  event.preventDefault();
}

function moveInteraction(event) {
  if (isDragging) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaX = clientX - previousX;
    const deltaY = clientY - previousY;
    earthMesh.rotation.y += deltaX * 0.005;
    earthMesh.rotation.x += deltaY * 0.005;
    earthMesh.rotation.x = Math.max(
      Math.min(earthMesh.rotation.x, Math.PI / 2),
      -Math.PI / 2
    );
    previousX = clientX;
    previousY = clientY;
    atmosphereMesh.rotation.copy(earthMesh.rotation);
    cloudMesh.rotation.copy(earthMesh.rotation);
  }
}

function endInteraction() {
  isDragging = false;
}

// Mouse events
window.addEventListener("mousedown", startInteraction);
window.addEventListener("mousemove", moveInteraction);
window.addEventListener("mouseup", endInteraction);

// Touch events
window.addEventListener("touchstart", startInteraction);
window.addEventListener("touchmove", moveInteraction);
window.addEventListener("touchend", endInteraction);

window.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomSpeed = 0.1;
  camera.position.z += event.deltaY * zoomSpeed;
  camera.position.z = Math.max(8, Math.min(30, camera.position.z));
});

// Moon controls (WASD and buttons)
const moonControls = { up: false, left: false, down: false, right: false };

// Keyboard controls (keeping WASD compatibility)
window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      moonControls.up = true;
      break;
    case "a":
      moonControls.left = true;
      break;
    case "s":
      moonControls.down = true;
      break;
    case "d":
      moonControls.right = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      moonControls.up = false;
      break;
    case "a":
      moonControls.left = false;
      break;
    case "s":
      moonControls.down = false;
      break;
    case "d":
      moonControls.right = false;
      break;
  }
});

// Button controls
const buttons = {
  up: document.getElementById("up"),
  down: document.getElementById("down"),
  left: document.getElementById("left"),
  right: document.getElementById("right"),
};

// Add preventDefault to stop touch events from interfering
buttons.up.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moonControls.up = true;
});
buttons.up.addEventListener("touchend", (e) => {
  e.preventDefault();
  moonControls.up = false;
});
buttons.up.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moonControls.up = true;
});
buttons.up.addEventListener("mouseup", (e) => {
  e.preventDefault();
  moonControls.up = false;
});

buttons.down.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moonControls.down = true;
});
buttons.down.addEventListener("touchend", (e) => {
  e.preventDefault();
  moonControls.down = false;
});
buttons.down.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moonControls.down = true;
});
buttons.down.addEventListener("mouseup", (e) => {
  e.preventDefault();
  moonControls.down = false;
});

buttons.left.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moonControls.left = true;
});
buttons.left.addEventListener("touchend", (e) => {
  e.preventDefault();
  moonControls.left = false;
});
buttons.left.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moonControls.left = true;
});
buttons.left.addEventListener("mouseup", (e) => {
  e.preventDefault();
  moonControls.left = false;
});

buttons.right.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moonControls.right = true;
});
buttons.right.addEventListener("touchend", (e) => {
  e.preventDefault();
  moonControls.right = false;
});
buttons.right.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moonControls.right = true;
});
buttons.right.addEventListener("mouseup", (e) => {
  e.preventDefault();
  moonControls.right = false;
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) {
    earthMesh.rotation.y += 0.005;
    atmosphereMesh.rotation.y += 0.005;
  }
  cloudMesh.rotation.y += 0.002;

  // Moon movement with corrected directions
  const speed = 0.02;
  if (moonControls.up) moonPhi -= speed; // Up decreases phi (moves up)
  if (moonControls.down) moonPhi += speed; // Down increases phi (moves down)
  if (moonControls.left) moonTheta += speed; // Left increases theta (moves left)
  if (moonControls.right) moonTheta -= speed; // Right decreases theta (moves right)

  moonPhi = Math.max(0.1, Math.min(Math.PI - 0.1, moonPhi));

  moon.position.x = moonRadius * Math.sin(moonPhi) * Math.cos(moonTheta);
  moon.position.y = moonRadius * Math.cos(moonPhi);
  moon.position.z = moonRadius * Math.sin(moonPhi) * Math.sin(moonTheta);

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
