precision mediump float;
uniform vec4 u_PointColor1;
uniform vec4 u_PointColor2;
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
  if((dist < 0.5) && (dist > 0.25)) {
    gl_FragColor = u_PointColor1;
  } else if(dist < 0.25) {
    gl_FragColor = u_PointColor2;
  } else {
    discard;
  }
}
