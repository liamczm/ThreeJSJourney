import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter{
    constructor(){
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspectRatio = Math.min(window.devicePixelRatio,2)

        //Resize Event
        window.addEventListener('resize',()=>{
            this.width = window.innEventEmitter
            this.height = window.innerHeight
            this.aspectRatio = Math.min(window.devicePixelRatio,2)
            //触发事件
            this.trigger('resize')
        })
    }
}