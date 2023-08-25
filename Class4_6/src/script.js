import * as THREE from 'three'
import gsap from 'gsap'

console.log(THREE)

const scene = new THREE.Scene()

// const geometry = new THREE.BoxGeometry(1,1,1)
// const material = new THREE.MeshBasicMaterial({color:0xff0000})
// const mesh = new THREE.Mesh(geometry,material)
// mesh.position.set(0.5,0.3,1)
// mesh.scale.set(0.3,2,0.1)
// mesh.rotation.set(0,Math.PI/2,Math.PI/2)
// scene.add(mesh)

//用group管理群组物件
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0})
)
group.add(cube1)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x00ff0f})
)
cube2.position.set(0.1,0.2,0.4)
cube2.scale.set(0.2,2,0.5)
group.add(cube2)
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x00ffff})
)
cube3.position.set(-0.3,-0.2,-0.5)
cube3.scale.set(1.2,0.2,3)
group.add(cube3)


//Axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

const sizes = {
    height:600,
    width:800
}
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas:document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)

// //Clock
// const clock = new THREE.Clock()
gsap.to(group.position,{duration:1,delay:1,x:2})
gsap.to(group.position,{duration:1,delay:2,x:-2})
//动画
const tick=()=>
{
    // //用时间而不是帧率统一动画速度
    // const elapsedTime = clock.getElapsedTime()

    // //更新物体
    // group.rotation.z=Math.sin(elapsedTime)
    // group.rotation.y=Math.cos(elapsedTime)

    //每帧重新渲染
    renderer.render(scene,camera)

    //必须：在下一帧调用函数
    window.requestAnimationFrame(tick)
}
tick()