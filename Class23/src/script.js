import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

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
 * Models
 */
let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf)=>
    {
        model = gltf.scene
        model.position.y = -1.2
        scene.add(model)
    })

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff',0.3)
const directionLight = new THREE.DirectionalLight('#ffffff',0.7)
directionLight.position.set(1,2,3)
scene.add(ambientLight,directionLight)

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3,0,0)
// const rayDirection = new THREE.Vector3(10,0,0)
// rayDirection.normalize()

// raycaster.set(rayOrigin,rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1,object2,object3])
// console.log(intersects)


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
 * Mouse
 */
const mouse = new THREE.Vector2()
window.addEventListener('mousemove',(event)=>
{
    //将鼠标移动映射到-1~1
    mouse.x = event.clientX/sizes.width*2-1
    mouse.y = -(event.clientY/sizes.height*2-1)
    // console.log(mouse)
})

window.addEventListener('click',(_event)=>
{
    // console.log('clicked')
    if (currentIntersect) {
        console.log('click on sphere')

        switch (currentIntersect.object) {
            case object1:
                console.log('object1')
                break;
            case object2:
                console.log('object2')
                break;
            case object3:
                console.log('object3')
                break;
        }
    }
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

let currentIntersect = null//witness变量

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Animate Objects
    object1.position.y = Math.sin(elapsedTime*0.8)*1.5
    object2.position.y = Math.sin(elapsedTime*0.2)*1.5
    object3.position.y = Math.sin(elapsedTime*1.2)*1.5


    // const rayOrigion = new THREE.Vector3(-3,0,0)
    // const rayDirection = new THREE.Vector3(1,0,0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigion,rayDirection)

    //Hovering
    raycaster.setFromCamera(mouse,camera)

    const objectsToTest = [object1,object2,object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    objectsToTest.forEach(object => {
        object.material.color.set('#ff0000')
    });

    intersects.forEach(intersect => {
        intersect.object.material.color.set('#0000ff')
    });

    if(intersects.length)//判断是否有物体相交
    {
        //之前没有物体相交（currentIntersect为空）
        if(currentIntersect==null)
        {
        console.log('mouse enter')
        }

        //更新currentIntersect
        currentIntersect = intersects[0]
    }
    else//没有物体相交
    {
        //但之前有物体相交（currentIntersect不为空）
        if (currentIntersect) {
            console.log('mouse leave')
        }

        //清空currentIntersect以便enter
        currentIntersect = null
    }

    if(model)
    {
        const modelIntersects=raycaster.intersectObject(model)

        if(modelIntersects.length)
            model.scale.set(1.2,1.2,1.2)
        else
            model.scale.set(1,1,1)
    }



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()