import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
//import * as lil from 'lil-gui'


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




//新建了一个对象用于存储gui中的对象
const parameters={
    color:0xff0000,
    spin:()=>
    {
        gsap.to(mesh.rotation,{duration:1,y:mesh.rotation.y+Math.PI*2})//注意使用加值而不是固定值
    }
}

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.color})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Debug UI
 */
const gui = new dat.GUI()
gui.add(mesh.scale,'y',0.1,3,0.1)
gui
    .add(mesh.scale,'z')
    .min(0.1)
    .max(5)
    .step(0.1)
gui
    .add(mesh.scale,'x')
    .min(0.1)
    .max(5)
    .step(0.1)
    .name('height')
gui.add(mesh,'visible')
gui.add(material,'wireframe')
gui.add(parameters,'spin')

gui
    .addColor(parameters,'color')
    .onChange(()=>
    {
        material.color.set(parameters.color)
    })

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
camera.position.z = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()