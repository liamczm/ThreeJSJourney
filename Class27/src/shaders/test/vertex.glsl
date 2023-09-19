uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float amplitude;
uniform float uTime;

attribute vec3 position;
// attribute float aRandom;

//默认uv
attribute vec2 uv;

//自定义vUv作为varing传入fragment
varying vec2 vUv;

uniform bool useTexturebool;

varying float useTexture;
varying float vElevation;

// varying float vRandom;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x*uFrequency.x+uTime)*amplitude;//根据x值变更z值，并符合sin函数
    elevation += sin(modelPosition.y*uFrequency.y+uTime)*amplitude;//根据y值变更z值，并符合sin函数
    
    modelPosition.z += elevation;
    // modelPosition.z += sin(modelPosition.x*uFrequency.x+uTime)*amplitude;//根据x值变更z值，并符合sin函数
    // modelPosition.z += sin(modelPosition.y*uFrequency.y+uTime)*amplitude;//根据y值变更z值，并符合sin函数
    // modelPosition.z += aRandom*0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // vRandom = aRandom;

    vUv = uv;

    if(useTexturebool)
        useTexture=1.0;
    else
        useTexture=0.0;
    // useTexture = useTexturebool;


    vElevation = elevation;
}