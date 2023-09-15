import * as dat from 'lil-gui'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash=== '#debug';//当在域名后输入#debug即为true
        if(this.active)
        {
            this.ui = new dat.GUI()
        }
    }
}