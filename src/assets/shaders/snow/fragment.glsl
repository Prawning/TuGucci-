varying vec3 vColor;
varying float vAlpha;

void main() {
    // Diffuse point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;
    float alpha = 1.0;
    if (strength < 0.3) {
        discard;
    }

    gl_FragColor = vec4(vec3(strength), 0.5);
}