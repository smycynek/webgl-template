
attribute vec4 a_Position;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform mat4 u_ModelMatrix;
attribute float a_PointSize;
void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;  // Set the vertex coordinates of the point
  gl_PointSize = a_PointSize;
}
