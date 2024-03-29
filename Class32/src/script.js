import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {RGBShiftShader} from 'three/examples/jsm/shaders/RGBShiftShader.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js' 
import { UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

//#region  Resize
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

    // Update effect composer
    effectComposer.setSize(sizes.width,sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//#endregion
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//#region Post Processing

// Render Target
const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height)
const effectComposer = new EffectComposer(renderer,renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(800,600,
    {
        //!但这种方法并不是所有浏览器都适配
        samples:renderer.getPixelRatio()===1?2:0//抗锯齿采样，值越大性能越低
        //! 若像素比超过1，不需要设置抗锯齿，这里设为1
    })

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

//*Passes
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = false
glitchPass.goWild = false
effectComposer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

//custom Postprocess
const TintShader = {
    uniforms:
    {
        //自由参数，自动识别，将原render的漫反射通道读取
        tDiffuse:{value:null},
        uTint:{value:null}
    },
    vertexShader:
    `
        varying vec2 vUv;
        void main()
        {
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;
        void main()
        {
            //读取原漫反射通道
            vec4 color = texture2D(tDiffuse,vUv);
            color.rgb +=uTint;
            gl_FragColor = color;
        }
    `
}
const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

//custom Displacement pass
const DisplacementShader = {
    uniforms:
    {
        //自由参数，自动识别，将原render的漫反射通道读取
        tDiffuse:{value:null},
        uTime:{value:null}
    },
    vertexShader:
    `
        varying vec2 vUv;
        void main()
        {
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;
        void main()
        {
            vec2 newUv = vec2(
                vUv.x,
                vUv.y+sin(vUv.x*10.0+uTime)*0.1
            );
            //读取原漫反射通道
            vec4 color = texture2D(tDiffuse,newUv);
            gl_FragColor = color;
        }
    `
}
const displacementPass = new ShaderPass(DisplacementShader)
displacementPass.material.uniforms.uTime.value=0
displacementPass.enabled = false
effectComposer.addPass(displacementPass)

//custom Displacement pass
const DisplacementNormalShader = {
    uniforms:
    {
        //自由参数，自动识别，将原render的漫反射通道读取
        tDiffuse:{value:null},
        uNormalMap:{value:null}
    },
    vertexShader:
    `
        varying vec2 vUv;
        void main()
        {
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap,vUv).xyz*2.0-1.0;//重映射到-1~1
            //控制强度
            vec2 newUv = vUv+normalColor.xy*0.5;
            vec4 color = texture2D(tDiffuse,newUv);

            //创建一个方向的光对Normal贴图产生影响
            vec3 lightDirection = normalize(vec3(-1.0,1.0,0.0));
            //计算光和去除黑边
            float lightness = clamp(dot(normalColor,lightDirection),0.0,1.0);
            color.rgb +=lightness*2.0;
            gl_FragColor = color;
        }
    `
}
const displacementNormalPass = new ShaderPass(DisplacementNormalShader)
displacementNormalPass.material.uniforms.uNormalMap.value = textureLoader.load(
    '/textures/interfaceNormalMap.png'
)

// displacementPass.material.uniforms.uTime.value=0
effectComposer.addPass(displacementNormalPass)

//!EffectComposer不支持encoding,导致场景变暗
//!所以加入GammaCorrectionShader将默认linear转换为sRGB
//!(除smaaPass之外)在所有的Pass最后加载
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

// SMAA
if(renderer.getPixelRatio()===1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
    console.log('Using SMAA')
}
//#endregion

//#region GUI
gui.add(dotScreenPass,'enabled').name('DotScreen')
gui.add(glitchPass,'enabled').name('Glitch')
gui.add(rgbShiftPass,'enabled').name('RGBshift')
gui.add(unrealBloomPass,'enabled').name('Bloom')

gui.add(unrealBloomPass,'strength',0,2,0.01)
gui.add(unrealBloomPass,'radius',0,2,0.01)
gui.add(unrealBloomPass,'threshold',0,1,0.01)

gui.add(tintPass.material.uniforms.uTint.value,'x',-1,1,0.01).name('r')
gui.add(tintPass.material.uniforms.uTint.value,'y',-1,1,0.01).name('g')
gui.add(tintPass.material.uniforms.uTint.value,'z',-1,1,0.01).name('b')
//#endregion

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Passes
    displacementPass.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()