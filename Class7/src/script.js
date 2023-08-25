import * as THREE from 'three'
//import gsap from 'gsap'
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls.js'

console.log(THREE)

const scene = new THREE.Scene()

//鼠标控制
const cursor={
    x:0,
    y:0
}
window.addEventListener('mousemove',(event)=>
{
    cursor.x=event.clientX/sizes.width-0.5//将鼠标区间映射到-1~1
    cursor.y=-(event.clientY/sizes.height-0.5)//THREE的y轴定义与event中的y轴正负相反
})

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


const sizes = {
    height:600,
    width:800
}
const aspectRatio = sizes.width/sizes.height
// const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)

//在正交相机中乘以宽高比保证画面比例正确
const camera = new THREE.OrthographicCamera(
    -2*aspectRatio,2*aspectRatio,2,-2,0.01,100
)
camera.position.z = 4

scene.add(camera)

//获取到canvas元素
const canvas=document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)

//Controls
const controls = new OrbitControls(camera,canvas)
// //默认control的相机目标为000，可以单独设，记得update
// controls.target.y=2
// controls.update()
//加入damping，让控制动画更顺滑
controls.enableDamping=true


//动画
const tick=()=>
{
    //更新相机
    // camera.position.x=Math.sin(cursor.x*Math.PI*2)//完整旋转一周
    // camera.position.z = Math.cos(cursor.x*3*Math.PI*2)
    // camera.position.y = cursor.y*5
    // camera.lookAt(group.position)

    //更新Controls
    //在每帧渲染才能使damping在鼠标松开时也生效
    controls.update()
    //每帧重新渲染
    renderer.render(scene,camera)

    //必须：在下一帧调用函数
    window.requestAnimationFrame(tick)
}
tick()

