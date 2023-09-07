import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Material
 */
const material = new THREE.MeshToonMaterial({
    color:parameters.materialColor,
    gradientMap:gradientTexture
})

/**
 * Objects
 */
const objectDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)
// Positions
mesh1.position.y = -objectDistance*0
mesh2.position.y = -objectDistance*1
mesh3.position.y = -objectDistance*2
// Positions X
mesh1.position.x = 1.5
mesh2.position.x = -1.5
mesh3.position.x = 1.5
scene.add(mesh1,mesh2,mesh3)

const sectionMeshes =[mesh1,mesh2,mesh3]

/**
 * Particles
 */
const particlesCount = 2000
const positions = new Float32Array(particlesCount*3)
for (let i = 0; i < particlesCount; i++) {
    positions[i*3] = (Math.random()-0.5)*10
    positions[i*3+1] = objectDistance*0.5-Math.random()*10*objectDistance*sectionMeshes.length
    positions[i*3+2] = (Math.random()-0.5)*10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
const particleMaterial = new THREE.PointsMaterial({
    color:parameters.materialColor,
    sizeAttenuation:true,
    size:0.03
})
const particles = new THREE.Points(particlesGeometry,particleMaterial)
scene.add(particles)

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

/**
 * gui
 */
gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>
    {
        material.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
    })


//#region Sizes
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
//#endregion


/**
 * Camera
 */
// Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

//当用户滚动时更新数据
window.addEventListener('scroll',()=>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY/sizes.height)//计算是否滚动到了对应区域
    
    if(newSection!=currentSection)
    {
        currentSection= newSection//将新section值赋予旧section成为当前section
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease:'power2.inOut',
                x:'+=6',
                y:'+=3',
                z:'+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor={
    x:0,
    y:0
}

window.addEventListener('mousemove',(event)=>
{
    cursor.x = event.clientX/sizes.width-0.5//单位化到-0.5~0.5
    cursor.y = event.clientY/sizes.height-0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    // 统一运行速度（忽略帧率影响）
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera
    camera.position.y = -(scrollY/sizes.height)*objectDistance
    
    //Parallax
    const parallaxX = -cursor.x*0.5
    const parallaxY = cursor.y*0.5
    cameraGroup.position.x += (parallaxX-cameraGroup.position.x)*5*deltaTime
    cameraGroup.position.y += (parallaxY-cameraGroup.position.y)*5*deltaTime

    //Animate
    sectionMeshes.forEach(mesh => {
        mesh.rotation.x += deltaTime*0.1
        mesh.rotation.y += deltaTime*0.12
    });

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()