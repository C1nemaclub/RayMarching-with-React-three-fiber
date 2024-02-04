

uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform bool uRemapped;
uniform vec3 uSpherePosition;
uniform float uBlendFactor;
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;
varying vec3 vCamPos;

#define MAX_STEPS 100.0
#define MAX_DIST 100.0
#define SURF_DIST 0.001

float sphere(vec3 p, float r, vec3 pos) {
    p -= pos;
    float d = length(p) - r;
    return d;
}
float sdBox(vec3 p, vec3 b){
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);

}

float smoothMin(float dstA, float dstB, float k){
    float h = max(k - abs(dstA-dstB), 0.) / k;
    return min(dstA, dstB) - h*h*h*k*1./6.0;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float getDist(vec3 p) {
    float dSphere = sphere(p, 1.4, uSpherePosition);
    float dBox =  sdBox(p, vec3(1.0));
    float d = smoothMin(dSphere , dBox, uBlendFactor);
    return d;
}

float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    float dS;
    for (float i = 0.0; i < MAX_STEPS; i += 1.0) {
    vec3 p = ro + rd * dO;
    dS = getDist(p);
    dO += dS;
    if (dS < SURF_DIST || dO > MAX_DIST) break;
    }
    return dO;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
    vec3 n = getDist(p) - vec3(
    getDist(p-e.xyy),
    getDist(p-e.yxy),
    getDist(p-e.yyx)
    );
    return normalize(n);
}


float sdSphere(vec3 p,float s){
    return length(p) - s;
}


float map(vec3 p){
    vec3 spherePosition = vec3(sin(uTime * 0.6) * 6.,0,0);
 
    float dist =  sdSphere(p - spherePosition, 2.);
    return dist;
}


void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 texture = texture2D(uTexture, vUv).rgb;

    vec3 ro = vCamPos;
    vec3 rd = normalize(vPosition - ro);
    vec3 color = vec3(0.0);
    float d = rayMarch(ro, rd);

    if (d < MAX_DIST){

    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);
    if (uRemapped == true) {
    n = n * 0.5 + 0.5;
    }
    color.rgb = n;
    } else {
    discard;
    }

    color = color;

    gl_FragColor = vec4(color, 1.0);
}