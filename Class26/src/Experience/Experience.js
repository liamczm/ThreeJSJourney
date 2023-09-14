import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";
import Camera from "./Camera"
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";

//设计模式：让Experience成为Singleton
let instance = null

export default class Experience
{
    constructor(canvas)
    {
        if (instance) return instance;//永远只返回第一个实例
        instance = this;//将当前实例赋值给全局变量
        //Global access，便于在浏览器中访问
        window.experience = this;

        // Options
        this.canvas = canvas;

        //Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        // Sizes Resize Event
        this.sizes.on('resize',()=>
        {
            this.resize()
        })
        // Time tick Event
        this.time.on('tick',()=>
        {
            this.update();
        })
    }
    resize()
    {
        //这里使用传播让事件通知子项
        //而不是直接在子项中听取事件，这会无法控制先后顺序
        this.camera.resize()
        this.renderer.resize()
    }
    update()
    {
        this.camera.update()
        this.renderer.update()
    }
}