import { Vector3, Vector4 } from "../webGlUtil/math";
import { Constants } from "./constants";

export class Defaults {
  public static readonly lightX: number = 0.2;
  public static readonly lightY: number = 0.4;
  public static readonly lightZ: number = 1.0;
  public static readonly transX: number = 0.25;
  public static readonly transY: number = 0.25;
  public static readonly transZ: number = 0.25;
  public static readonly rotateX: number = 0;
  public static readonly rotateY: number = 0;
  public static readonly rotateZ: number = 0;
  public static readonly eyeX: number = 2.0;
  public static readonly eyeY: number = 2.0;
  public static readonly eyeZ: number = 4.0;
  public static readonly upX: number = 0;
  public static readonly upY: number = 1;
  public static readonly upZ: number = 0;
  public static readonly lookX: number = 0;
  public static readonly lookY: number = 0;
  public static readonly lookZ: number = 0;
  public static readonly orthoLeft: number = -2;
  public static readonly orthoRight: number = 2;
  public static readonly orthoBottom: number = -2;
  public static readonly orthoTop: number = 2;
  public static readonly orthoNear: number = -4;
  public static readonly orthoFar: number = 4;
  public static readonly perspectiveFieldOfView: number = 45;
  public static readonly perspectiveAspectRatio: number = 1;
  public static readonly perspectiveNear: number = 0.1;
  public static readonly perspectiveFar: number = 100;
  public static readonly projectionType: string = Constants.PERSPECTIVE;
  public static readonly entityType = Constants.TRIANGLE
}
