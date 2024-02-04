

uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;
varying vec3 vCamPos;

void main(){
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vCamPos =  (vec4(cameraPosition, 1.0) * modelMatrix).xyz;

    vec3 pos = position;
    // pos.z += sin(pos.x  * 2.0 + uTime);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}