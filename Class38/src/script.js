import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'


//#region Base
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//#endregion

//#region Loaders
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
//#endregion

//#region Textures
const bakedTexture=textureLoader.load('bakeCave_remap.jpg')
bakedTexture.flipY=false;
bakedTexture.colorSpace=THREE.SRGBColorSpace;
//#endregion

//#region Material
const bakedMaterial = new THREE.MeshBasicMaterial({map:bakedTexture})
const poleLightMaterial = new THREE.MeshBasicMaterial({color:0xffffff})
// portal Material

debugObject.portalColorStart = '#ff0000';
debugObject.portalColorEnd = '#0000ff';
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms:{
        uTime:{value:0},
        uColorStart:{value:new THREE.Color(debugObject.portalColorStart)},
        uColorEnd:{value:new THREE.Color(debugObject.portalColorEnd)},
    },
    vertexShader:portalVertexShader,
    fragmentShader:portalFragmentShader, 
})

gui
    .addColor(debugObject, 'portalColorStart')
    .onChange(()=>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })
gui
    .addColor(debugObject, 'portalColorEnd')
    .onChange(()=>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })
//#endregion


//#region Blender Scene
gltfLoader.load(
    'cave_merged.glb',
    (gltf) =>
    {
        const bakeMesh = gltf.scene.children.find(child=>child.name === 'baked')

        const poleLightAMesh = gltf.scene.children.find(child=>child.name === 'poleLightA')
        
        const poleLightBMesh = gltf.scene.children.find(child=>child.name === 'poleLightB')
        const poleLightCMesh = gltf.scene.children.find(child=>child.name === 'poleLightC')
        const poleLightDMesh = gltf.scene.children.find(child=>child.name === 'poleLightD')
        const poleLightEMesh = gltf.scene.children.find((child)=>child.name === 'poleLightE')
        const poleLightFMesh = gltf.scene.children.find((child)=>
        {
            return child.name === 'poleLightF'
        })
        const portalLightMesh = gltf.scene.children.find(child=>child.name === 'portalLight')

        bakeMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        poleLightCMesh.material = poleLightMaterial
        poleLightDMesh.material = poleLightMaterial
        poleLightEMesh.material = poleLightMaterial
        poleLightFMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial
        //console.log(gltf.scene)
        scene.add(gltf.scene)
    }
)
//#endregion

//#region Fireflies
const firefliesGeo = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount*1)
for(let i = 0; i < firefliesCount ; i++)
{
    positionArray[i * 3+0] = (Math.random() - 0.5) * 4
    positionArray[i * 3+1] = Math.random() * 4
    positionArray[i * 3+2] = (Math.random() - 0.5) * 4

    scaleArray[i]= Math.random()
}

firefliesGeo.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeo.setAttribute('aScale', new THREE.BufferAttribute(scaleArray,1 ))

const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
        uSize:{value:100},
        uTime:{value:0}
    },
    vertexShader:firefliesVertexShader,
    fragmentShader:firefliesFragmentShader,
    transparent:true,
    blending:THREE.AdditiveBlending,
    depthWrite:false
})
gui.add(firefliesMaterial.uniforms.uSize, 'value', 0, 300).step(1).name('firefliesSize')
const firefiles = new THREE.Points(firefliesGeo, firefliesMaterial)
scene.add(firefiles)

//#region Sizes
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
    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})
//#endregion

//#region Camera
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -4
camera.position.y = 2
camera.position.z = -4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//#endregion

//#region Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace=THREE.SRGBColorSpace;

debugObject.clearColor='#201919'
renderer.setClearColor(debugObject.clearColor)
gui
    .addColor(debugObject, 'clearColor')
    .onChange(()=>{renderer.setClearColor(debugObject.clearColor)})
//#endregion

//#region Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
//#endregion