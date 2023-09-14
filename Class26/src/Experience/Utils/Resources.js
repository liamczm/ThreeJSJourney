import EventEmitter from "./EventEmitter";
import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        //Options
        this.sources = sources;

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }
    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }
    startLoading()
    {
        //Load each Source
        this.sources.forEach(source => {
            if(source.type=='gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                    }
                )
            }
            else if(source.type=='cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                    }
                )
            }
            else if(source.type=='texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file)=>
                    {
                        this.sourceLoaded(source,file)
                    }
                )
            }
        });
    }
    sourceLoaded(source,file)
    {
        // 将资源导入
        this.items[source.name] = file
        this.loaded++
        //判断是否完成
        if(this.loaded==this.toLoad)
        {
            this.trigger('ready')
        }
    }
}