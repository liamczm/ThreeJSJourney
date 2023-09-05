import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * House
 */
const house = new THREE.Group();

const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAmbientOcclusionTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = walls.geometry.parameters.height / 2;

house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 2, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = door.geometry.parameters.height / 2 - 0.2;
door.position.z = walls.geometry.parameters.depth / 2 + 0.01;

house.add(door);

/**
 * Bushes
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

scene.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = walls.geometry.parameters.width + Math.random() * 6; //用画圆的方式规定范围
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, graveGeometry.parameters.height / 2 - 0.2, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.8;
  grave.rotation.z = (Math.random() - 0.5) * 0.2;
  grave.castShadow = true;
  graves.add(grave);
}

scene.add(graves);
scene.add(house);

// Floor
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

const repeatTimes = 8;
grassColorTexture.repeat.set(repeatTimes, repeatTimes);
grassAmbientOcclusionTexture.repeat.set(repeatTimes, repeatTimes);
grassNormalTexture.repeat.set(repeatTimes, repeatTimes);
grassRoughnessTexture.repeat.set(repeatTimes, repeatTimes);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(
  0,
  door.geometry.parameters.height,
  door.position.z + 0.1
);
house.add(doorLight);

// Fog
const fog = new THREE.Fog("#262837", 1, 10);
scene.fog = fog;

/**
 * Ghosts
 */
const sphere = new THREE.SphereGeometry(0.3, 16, 16);
const ghost1 = new THREE.Group();
const ghost2 = new THREE.Group();
const ghost3 = new THREE.Group();
const ghost1Light = new THREE.PointLight("#ff00ff", 2, 3);
const ghost1Geometry = new THREE.Mesh(
  sphere,
  new THREE.MeshStandardMaterial({ emissive: "#ff00ff" })
);
ghost1.add(ghost1Light, ghost1Geometry);
const ghost2Light = new THREE.PointLight("#00ffff", 2, 3);
const ghost2Geometry = new THREE.Mesh(
  sphere,
  new THREE.MeshStandardMaterial({ emissive: "#00ffff" })
);
ghost2.add(ghost2Light, ghost2Geometry);
const ghost3Light = new THREE.PointLight("#ffff00", 2, 3);
const ghost3Geometry = new THREE.Mesh(
  sphere,
  new THREE.MeshStandardMaterial({ emissive: "#ffff00" })
);
ghost3.add(ghost3Light, ghost3Geometry);

scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2Light.castShadow = true;
ghost3Light.castShadow = true;

walls.castShadow = true;
floor.receiveShadow = true;
//Optimize
moonLight.shadow.mapSize.set(256, 256);
moonLight.shadow.camera.far = 15;
doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

ghost1Light.shadow.mapSize.set(256, 256);
ghost1Light.shadow.camera.far = 7;

ghost2Light.shadow.mapSize.set(256, 256);
ghost2Light.shadow.camera.far = 7;

ghost3Light.shadow.mapSize.set(256, 256);
ghost3Light.shadow.camera.far = 7;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 背景修正
renderer.setClearColor("#262837"); //和雾颜色相同就看不到场地边缘了

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);
  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 4;
  ghost2.position.z = Math.sin(ghost2Angle) * 4;
  ghost2.position.y = Math.sin(elapsedTime * 3);
  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
