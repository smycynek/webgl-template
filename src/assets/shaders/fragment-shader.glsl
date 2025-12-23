#version 300 es
precision mediump float;
uniform bool u_UseStaticColor;
uniform bool u_FancyPoints;
in vec4 v_Color;
out vec4 v_Colorf;
uniform vec4 u_PointColor1;
uniform vec4 u_PointColor2;
void main() {
  if(u_UseStaticColor == true) {   // If true, we are rendering points, so only use one color.
    if (u_FancyPoints == true) {
      float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
      if((dist < 0.5) && (dist > 0.25)) {
        v_Colorf = u_PointColor1;
      } else if(dist < 0.25) {
        v_Colorf = u_PointColor2;
      } else {
        discard;
      }
    } else {
      v_Colorf = u_PointColor1;
    }
  } else {
    v_Colorf = v_Color;
  } 
}
