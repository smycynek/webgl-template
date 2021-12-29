export class Shaders {
  public static readonly VSHADER_SOURCE =

    'attribute vec4 a_TriangleColor;\n' +
    'attribute vec4 a_Normal;\n' +  // Normal is hard coded
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightDirection;\n' +
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'uniform mat4 u_RotationMatrix;\n' +
    'uniform mat4 u_TranslationMatrix;\n' +
    'attribute float a_PointSize;\n' +  // Only used in point rendering
    'varying vec4 v_Color;\n' + // Fragment color
    'void main() {\n' +

    // Rotate the normals along with the model, as they are provided in advance and not
    // calculated after the final translation.
    '  vec4 a_NormalR = u_TranslationMatrix * u_RotationMatrix * a_Normal;\n' +
    '  vec3 normal = normalize(a_NormalR.xyz);\n' +

    // Dot product of the light direction and the orientation of a surface (the normal)
    '  float brightnessScalar = max(dot(u_LightDirection, normal), 0.0);\n' +
    // Calculate how much to scale the color down by (Lambert Cosine Rule)
    '  vec3 finalColor = u_LightColor * a_TriangleColor.rgb * brightnessScalar;\n' +
    '  v_Color = vec4(finalColor, a_TriangleColor.a);\n' +
    '  gl_Position =  u_ProjMatrix * u_ViewMatrix * u_TranslationMatrix * u_RotationMatrix * a_Position;\n' + // Set the vertex coordinates of the point
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

  // Fragment shader program
  public static readonly FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform bool u_UseStaticColor;\n' +
    'varying vec4 v_Color;\n' +
    'uniform vec4 u_PointColor;\n' +
    'void main() {\n' +
    'if (u_UseStaticColor == true) {\n' +  // If true, we are rendering points, so only use one color
    '  gl_FragColor = u_PointColor;\n' + // Set all point colors to the single point color.
    '}\n' +
    'else {\n' +
    '  gl_FragColor = v_Color;\n' + // Set the fragment color to the varying color
    '}\n' +
    '}\n';
}
