export class Shaders {
  public static readonly VSHADER_SOURCE =
    `
    attribute vec4 a_TriangleColor;
    attribute vec4 a_Normal;   // Normal is hard coded
    uniform vec3 u_LightColor;
    uniform vec3 u_LightDirection;
    uniform vec3 u_LightPosition;
    uniform bool u_UseDirectionalLight;
    attribute vec4 a_Position;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_RotationMatrix;
    uniform mat4 u_TranslationMatrix;
    attribute float a_PointSize;   // Only used in point rendering
    varying vec4 v_Color;  // Fragment color
    void main() {

    // Rotate the normals along with the model, as they are provided in advance and not
    // calculated after the final translation.
      vec4 a_NormalR = u_TranslationMatrix * u_RotationMatrix * a_Normal;
      vec3 normal = normalize(a_NormalR.xyz);

    // Dot product of the light direction and the orientation of a surface (the normal)
      vec3 light_direction;
      if (u_UseDirectionalLight == true) {
       light_direction = u_LightDirection;
      }
      else { // Note -- with the point light model, the normal is the same for both triangles of each face,
        // but the vertex position varies,
        // so you get some nice pseudo pixel-level shading, but not quite Phong-level
        vec4 vertex_position = u_ViewMatrix * u_TranslationMatrix * u_RotationMatrix * a_Position;
        vec3 point_light_direction = normalize(u_LightPosition - vec3(vertex_position));
        light_direction = point_light_direction;
      }
      float brightnessScalar = max(dot(light_direction, normal), 0.0);
     // Calculate how much to scale the color down by (Lambert Cosine Rule)
      vec3 finalColor = u_LightColor * a_TriangleColor.rgb * brightnessScalar;
      v_Color = vec4(finalColor, a_TriangleColor.a);
      gl_Position =  u_ProjMatrix * u_ViewMatrix * u_TranslationMatrix * u_RotationMatrix * a_Position;  // Set the vertex coordinates of the point
      gl_PointSize = a_PointSize;
    }
    `;

  // Fragment shader program
  public static readonly FSHADER_SOURCE =
    `
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
    `;
}
