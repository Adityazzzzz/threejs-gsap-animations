// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("logo"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 🧠 ChatGPT-style knot geometry
const geometry = new THREE.TorusKnotGeometry(
  1.2,   // radius
  0.25,  // tube thickness
  300,   // tubular segments (smoothness)
  32,    // radial segments
  2,     // p
  3      // q
);

// Material (ChatGPT white look)
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.3,
  roughness: 0.25
});

const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Lighting (VERY IMPORTANT)
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 5, 5);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-5, -3, 5);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);

scene.add(keyLight, fillLight, ambient);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  knot.rotation.x += 0.004;
  knot.rotation.y += 0.006;

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
