#define PI 3.14159265359//常量

varying vec2 vUv;
//没有原生random，造假random
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))*43758.5453123);
}
vec2 rotate(vec2 uv,float rotation,vec2 mid)
{
    return vec2(
        cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x,
        cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y
    );
}
//?Classic Perlin 2D Noise
//?by Stefan Gustavson
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.853733854472351*vec4(dot(g00, g00), dot(g01, g00), dot(g10, g00), dot(g11, g00));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    //*Pattern4
    // float strength = vUv.x;
    //*Pattern5
    // float strength = 1.0-vUv.x;
    //*Pattern6
    // float strength = vUv.y*10;
    //*Pattern7
    // float strength = mod(vUv.y*10.0,1.0);
    //*Pattern8
    // strength = strength<0.5?0.0:1.0; //条件判断会影响性能
    // strength = step(0.5,strength);//用step代替
    //*Pattern11
    // float strength = step(0.8,mod(vUv.x*10.0,1.0));
    // strength+=step(0.8,mod(vUv.y*10.0,1.0));
    //*Pattern12
    // float strength = step(0.8,mod(vUv.x*10.0,1.0));
    // strength*=step(0.8,mod(vUv.y*10.0,1.0));

    //*Pattern14
    // float barX = step(0.4,mod(vUv.x*10.0,1.0));
    // barX*=step(0.8,mod(vUv.y*10.0,1.0));
    
    // float barY = step(0.8,mod(vUv.x*10.0,1.0));
    // barY*=step(0.4,mod(vUv.y*10.0,1.0));
    
    // float strength = barX+barY;
    //*Pattern15
    // float barX = step(0.4,mod(vUv.x*10.0,1.0));
    // barX*=step(0.8,mod(vUv.y*10.0+0.2,1.0));
    
    // float barY = step(0.8,mod(vUv.x*10.0+0.2,1.0));
    // barY*=step(0.4,mod(vUv.y*10.0,1.0));
    
    // float strength = barX+barY;
    
    //*Pattern16
    // float strength=abs(vUv.x-0.5);
    //*Pattern17
    // float strength = min(abs(vUv.x-0.5),abs(vUv.y-0.5));
    //*Pattern19
    // float strength =step(0.2, max(abs(vUv.x-0.5),abs(vUv.y-0.5)));
    //*Pattern21
    // float strength = floor(vUv.x*10.0)/10.0;
    //*Pattern22
    // float strength = floor(vUv.x*10.0)/10.0;
    // strength*=floor(vUv.y*10.0)/10.0;

    //*Pattern23
    // float strength = random(vUv);
    //*Pattern24
    // vec2 gridUV = vec2(
    //     floor(vUv.x*10.0)/10.0,
    //     floor(vUv.y*10.0)/10.0
    // );
    // float strength = random(gridUV);
    //*Pattern25
    // vec2 gridUV = vec2(
    //     floor(vUv.x*10.0)/10.0,
    //     floor((vUv.y+vUv.x)*10.0)/10.0
    // );
    // float strength = random(gridUV);

    //*Pattern26
    // float strength = length(vUv);
    //*Pattern27
    // float strength = length(vUv-0.5);
    //*Pattern27.5
    // float strength=distance(vUv,vec2(0.8));
    //*Pattern29
    // float strength = 0.02/distance(vUv,vec2(0.5));

    //*Pattern30
    // vec2 ligthUV = vec2(
        // vUv.x*0.1+0.45,
        // vUv.y*0.5+0.25
    // );
    // float strength = 0.02/distance(ligthUV,vec2(0.5));
    //*Pattern31
    // vec2 lightUvX = vec2(vUv.x*0.1+0.45,vUv.y*0.5+0.25);
    // float lightX = 0.015/distance(lightUvX,vec2(0.5));
    // vec2 lightUvY = vec2(vUv.y*0.1+0.45,vUv.x*0.5+0.25);
    // float lightY = 0.015/distance(lightUvY,vec2(0.5));

    // float strength=lightX*lightY;
    //*Pattern32
    // vec2 rotatedUV = rotate(vUv, 0.3*PI,vec2(0.5));
    // vec2 lightUvX = vec2(rotatedUV.x*0.1+0.45,rotatedUV.y*0.5+0.25);
    // float lightX = 0.015/distance(lightUvX,vec2(0.5));
    // vec2 lightUvY = vec2(rotatedUV.y*0.1+0.45,rotatedUV.x*0.5+0.25);
    // float lightY = 0.015/distance(lightUvY,vec2(0.5));

    // float strength=lightX*lightY;

    //*Pattern33
    // float strength = step(0.2,distance(vUv,vec2(0.5)));
    //*Pattern34
    // float strength = abs(distance(vUv,vec2(0.5))-0.25);
    //*Pattern35
    // float strength = step(0.02,abs(distance(vUv,vec2(0.5))-0.25));
    
    //*Pattern37
    // vec2 wavedUV = vec2(
    //     vUv.x,
    //     vUv.y+sin(vUv.x*30.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(wavedUV,vec2(0.5))-0.25));
    //*Pattern38
    // vec2 wavedUV = vec2(
    //     vUv.x+sin(vUv.y*30.0)*0.1,
    //     vUv.y+sin(vUv.x*30.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(wavedUV,vec2(0.5))-0.25));
   //*Pattern39 
    // vec2 wavedUV = vec2(
    //     vUv.x+sin(vUv.y*100.0)*0.1,
    //     vUv.y+sin(vUv.x*100.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(wavedUV,vec2(0.5))-0.25));
    //*Pattern40
    // float angle = atan(vUv.x,vUv.y);
    // float strength = angle;
    //*Pattern41
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // float strength = angle;
    //*Pattern42
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // angle/=PI*2.0;
    // angle+=0.5;
    // float strength = angle;
    //*Pattern43
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // angle/=PI*2.0;
    // angle+=0.5;
    // angle*=100.0;
    // angle = mod(angle,1.0);
    // float strength = angle;
    //*Pattern43
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // angle/=PI*2.0;
    // angle+=0.5;
    // float strength = sin(angle*50.0);
    
    //*Pattern45
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // angle/=PI*2.0;
    // angle+=0.5;
    // float sinusoid = sin(angle*50.0);

    // float radius = 0.25+sinusoid*0.1;
    // float strength = 1.0-step(0.01,abs(distance(vUv,vec2(0.5))-radius));
    
    //*Pattern46:Perlin Noise
    // float strength = cnoise(vUv*10.0);
    //*Pattern47
    // float strength = step(0.0,cnoise(vUv*10.0));
    //*Pattern48
    // float strength = 1.0 - abs(cnoise(vUv*10.0));
    //*Pattern49
    // float strength = sin(cnoise(vUv*10.0)*20.0);
    //*Pattern50
    float strength = step(0.9,sin(cnoise(vUv*10.0)*20.0));

    //!Clamp strength to 0.0-1.0 range
    strength = clamp(strength,0.0,1.0);
    //! Colored version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixColor = mix(blackColor,uvColor,strength);
    gl_FragColor = vec4(mixColor, 1.0);

    //!Black&White version
    // gl_FragColor = vec4(strength, strength,strength, 1.0);
}