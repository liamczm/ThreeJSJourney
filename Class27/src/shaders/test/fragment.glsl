precision mediump float;
// varying float vRandom;
uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float useTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb*=vElevation*20.0+0.5;//改变亮度而不改变透明度
    if(useTexture==1.0)
        gl_FragColor=textureColor;
    else
        gl_FragColor = vec4(uColor, 1.0);//可以加入Vrandom作为颜色
}