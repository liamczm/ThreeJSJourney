import Experience from "./Experience";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class Camera{
    constructor()
    {
        // 最简单的：全局变量，但耦合性太高
        // this.experience = window.experience
        // 或：传递参数，但对于多层class需要一直迭代
        // this.experience = experience
        // 最佳：singleton 单例类
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        // console.log(this)
        this.setInstance();
        this.setOrbitControl();
    }
    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35,this.sizes.width / this.sizes.height, 0.1, 10000);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }
    setOrbitControl()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    update()
    {
        //在每一帧更新Control
        this.controls.update();
    }

}