import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Debug Object
const debugObject = {
    depthColor:'#186691',
    surfaceColor:'#9bd8ff'
}
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader:waterVertexShader,
    fragmentShader:waterFragmentShader,
    uniforms:
    {
        uTime:{value:0},
        uBigWavesElevation:{value:0.2},
        uBigWavesFrequency:{value:new THREE.Vector2(4, 1.5)},
        uBigWavesSpeed:{value:0.75},

        uSmallWavesElevation:{value:0.15},
        uSmallWavesFrequency:{value:3},
        uSmallWavesSpeed:{value:0.2},
        uSmallWavesIteration:{value:3.0},

        uDepthColor:{value:new THREE.Color(debugObject.depthColor)},
        uSurfaceColor:{value:new THREE.Color(debugObject.surfaceColor)},
        uColorOffset:{value:0.25},
        uColorMultiplier:{value:2},
    }
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

//#region GUI
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1,0.01).name('Elevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10,0.01).name('FrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10,0.01).name('FrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 5,0.01).name('Speed')
gui.addColor(debugObject, 'depthColor').name('Depth Color').onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor))
gui.addColor(debugObject, 'surfaceColor').name('Surface Color').onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))
gui.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1,0.01).name('Color Offset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10,0.01).name('Color Multiplier')  
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1,0.01).name('SmallElevation')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 5,0.01).name('SmallSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 10,0.01).name('SmallFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesIteration, 'value', 1, 5,1).name('SmallIteration') 
//#endregion
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
camera.position.set(1, 1, 1)
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

    //Update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()