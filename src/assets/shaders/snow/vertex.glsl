uniform float uSize;
uniform float uTime;
uniform float time_passed;
attribute float aScale;
varying vec3 vColor;
varying float vAlpha;

void main() {
    /**
     * Position
     */

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y -= uTime * 15.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = aScale * uSize;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
    vAlpha = 1.0;
}
