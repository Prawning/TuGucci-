varying vec3 vColor;
varying float vAlpha;

void main() {
    // Disc
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = step(0.5, strength);
    strength = 1.0 - strength;
    float alpha = 1.0;
    if (strength == 0.0) {
        alpha = 0.0;
    };

    gl_FragColor = vec4(vec3(strength), alpha);
}