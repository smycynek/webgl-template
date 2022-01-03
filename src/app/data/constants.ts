import { Vector3, Vector4 } from '../util/math';


export enum ModelChoice {
  HardCodedCube = 1,
  NineInchNails = 2,
  ChessRook = 3,
}

export class Constants {
  public static readonly VERTEX = 'VERTEX';
  public static readonly TRIANGLE = 'TRIANGLE';
  public static readonly ORTHO = 'ORTHO';
  public static readonly PERSPECTIVE = 'PERSPECTIVE';
  public static readonly POINT_LIGHT = 'POINT_LIGHT';
  public static readonly DIRECTIONAL_LIGHT = 'DIRECTIONAL_LIGHT';

  public static readonly pointColor: Vector4 = new Vector4([1.0, 1.0, 0.0, 1.0]);
  public static readonly lightColor: Vector3 = new Vector3([1.0, 1.0, 1.0]);
  public static readonly pointSize = 2.0;
  public static readonly triangleColor: Vector4 = new Vector4([1, 1, 1, 1]);


  public static toString(): string {
    const data = `
---Static/Constant data------
lightColor: ${Constants.lightColor.elements}
pointSize: ${Constants.pointSize}
pointColor: ${Constants.pointColor.elements}
triangleColor: ${Constants.triangleColor.elements}
`;
    return data;
  }

  public static print(): void {
    console.log(Constants.toString());
  }
}