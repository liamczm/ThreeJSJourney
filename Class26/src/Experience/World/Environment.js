import Experience from "../Experience";
import * as THREE from "three"

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.environmentMap()
    }
    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff',4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024,1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3,3,-2.25)
        this.scene.add(this.sunLight)

        //Debug
        if(this.debug.active)
        {
            this.debugFolder.add(this.sunLight, 'intensity').min(0).max(10).step(0.01).name('太阳强度')
            this.debugFolder.add(this.sunLight.position, 'x').min(-5).max(5).step(0.01).name('太阳位置x')
            this.debugFolder.add(this.sunLight.position, 'y').min(-5).max(5).step(0.01).name('太阳高度')
            this.debugFolder.add(this.sunLight.position, 'z').min(-5).max(5).step(0.01).name('太阳位置z')
        }
    }
    environmentMap()
    {
        this.environmentMap={}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        //更新所有模型的环境贴图
        this.environmentMap.updateMaterial=()=>
        {
            this.scene.traverse((child)=>
            {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterial()

        //Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap,"intensity")
                .min(0).max(4).step(0.01)
                .name("环境强度")
                .onChange(this.environmentMap.updateMaterial)
        }
    }
}