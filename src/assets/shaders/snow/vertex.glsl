uniform float uSize;
uniform float uTime;
attribute float aScale;
varying vec3 vColor;
varying float vAlpha;

void main() {
    /**
     * Position
     */
    // position.y -= uTime;
    vec3 changed_position = vec3(position.x + sin(uTime * distance(position.x, position.z) * 0.01) , position.y - uTime, position.z);
    if (changed_position.y < 0.0) {
        changed_position.y += 50.0;
    }
    vec4 modelPosition = modelMatrix * vec4(changed_position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = aScale * uSize;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
    vAlpha = 1.0;

    /**
     * Animation
     */

}