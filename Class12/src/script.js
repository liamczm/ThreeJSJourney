import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as GUI from 'lil-gui'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new GUI.GUI()
// const gui = new dat.GUI()


/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const enviromentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
],)

// const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
// const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
// const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
// const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
// const gradientTexture = textureLoader.load('/textures/gradients/3.png')
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Material
 */
//MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial(
//     {
//         color:'blue',map:matcapTexture
//     }
// )
// material.transparent = true
// material.opacity=0.6
// material.side = THREE.DoubleSide

//MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

//MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.8
material.roughness=0.1
material.envMap = enviromentMapTexture

// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(1,1)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material,'metalness',0,1,0.001)
gui.add(material,'roughness',0,1,0.001)
// gui.add(material,'aoMapIntensity',0,1,0.001)
// gui.add(material,'displacementScale',0,1,0.01)

/**
 * Object
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,64,64),
    material
)
sphere.position.x = -1.5
// sphere.geometry.setAttribute(
//     'uv2',
//     new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2)
// )
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,100,100),
    material
)
// plane.geometry.setAttribute(
//     'uv2',
//     new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2)
// )
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,64,128),
    material
)
torus.position.x = 1.5
// torus.geometry.setAttribute(
//     'uv2',
//     new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2)
// )

scene.add(sphere,plane,torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.set(2,3,4)
scene.add(ambientLight,pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const speed = 0.5

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Objects
    sphere.rotation.y = speed*elapsedTime
    plane.rotation.y = speed*elapsedTime
    torus.rotation.y = speed*elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()