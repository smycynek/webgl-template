
    precision mediump float;
    uniform bool u_UseStaticColor;
    varying vec4 v_Color;
    uniform vec4 u_PointColor;
    void main() {
    if (u_UseStaticColor == true) {   // If true, we are rendering points, so only use one color
      gl_FragColor = u_PointColor;  // Set all point colors to the single point color.
    }
    else {
      gl_FragColor = v_Color;  // Set the fragment color to the varying color
    }
  }
