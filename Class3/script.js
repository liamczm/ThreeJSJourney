const scene = new THREE.Scene()

//几何体
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:0xff0000})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

//Size
const sizes={
    width:800,
    height:600
}

//Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z = 3//相机朝镜头外移动3
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl');//索引到index.html的canvas元素并存储在变量中
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
//设置大小
renderer.setSize(sizes.width,sizes.height)

//渲染场景
renderer.render(scene,camera)