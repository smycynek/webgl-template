import { Component } from '@angular/core';

import { Constants } from './data/constants';
import { Defaults } from './data/defaults';
import { Shaders } from './data/shaders';
import { Matrix4 } from './webGlUtil/math';
import { WebGLUtil } from './webGlUtil/WebGLUtil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.template.html',
  styles: []
})
export class AppComponent {
  public init: boolean = false;
  public lightX: number = Defaults.lightX;
  public lightY: number = Defaults.lightY;
  public lightZ: number = Defaults.lightZ;
  public transX: number = Defaults.transX;
  public transY: number = Defaults.transY;
  public transZ: number = Defaults.transZ;
  public rotateX: number = Defaults.rotateX;
  public rotateY: number = Defaults.rotateY;
  public rotateZ: number = Defaults.rotateZ;
  public eyeX: number = Defaults.eyeX;
  public eyeY: number = Defaults.eyeY;
  public eyeZ: number = Defaults.eyeZ;
  public upX: number = Defaults.upX;
  public upY: number = Defaults.upY;
  public upZ: number = Defaults.upZ;
  public lookX: number = Defaults.lookX;
  public lookY: number = Defaults.lookY;
  public lookZ: number = Defaults.lookZ;
  public entityType: string = Defaults.entityType;
  public orthoLeft: number = Defaults.orthoLeft;
  public orthoRight: number = Defaults.orthoRight;
  public orthoBottom: number = Defaults.orthoBottom;
  public orthoTop: number = Defaults.orthoTop;
  public orthoNear: number = Defaults.orthoNear;
  public orthoFar: number = Defaults.orthoFar;
  public perspectiveFieldOfView: number = Defaults.perspectiveFieldOfView;
  public perspectiveAspectRatio: number = Defaults.perspectiveAspectRatio;
  public perspectiveNear: number = Defaults.perspectiveNear;
  public perspectiveFar: number = Defaults.perspectiveFar;
  public projectionType: string = Defaults.projectionType;
  public title: string = 'WebGL Angular/TypeScript/Webpack Template - Desktop';


  public setPointMode() {
    this.entityType = Constants.POINT;
    this.start();
  }
  public setTriangleMode() {
    this.entityType = Constants.TRIANGLE;
    this.start();
  }
  public setOrthoMode() {
    this.projectionType = Constants.ORTHO;
    this.eyeZ = 1;
    this.start();
  }
  public setPerspectiveMode() {
    this.projectionType = Constants.PERSPECTIVE;
    this.eyeZ = 4.0;
    this.start();
  }
  public initScreen() {
    if (!this.init) {
      this.start();
    }
  }

  public start() {
    this.init = true;
    let gl = this.getContext();
    if (!gl) {
      return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    WebGLUtil.initShaders(gl, Shaders.VSHADER_SOURCE, Shaders.FSHADER_SOURCE);

    const pointCount = this.loadGLData(gl);
    this.logState();

    if (this.entityType == Constants.POINT) {
      gl.drawArrays(gl.POINTS, 0, Constants.vertices.length / 3);
    }
    else {
      gl.drawElements(gl.TRIANGLES, pointCount, gl.UNSIGNED_BYTE, 0);
    }
  }

  private getContext(): any | null {
    let gl;

    const canvas: HTMLElement | null = document.getElementById('gl_canvas');
    if (!canvas) {
      console.log('Failed to get canvas');
      return null;
    }
    if (canvas instanceof HTMLCanvasElement) {
      // Get the rendering context for WebGL
      gl = canvas.getContext('webgl')
      if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return null;
      }

    }
    else {
      console.log('Canvas is wrong type');
      return null;
    }
    return gl;
  }

  private setupProjection(): Matrix4 {
    const projMatrix = new Matrix4();
    if (this.projectionType == Constants.ORTHO) {
      projMatrix.setOrtho(
        this.orthoLeft,
        this.orthoRight,
        this.orthoBottom,
        this.orthoTop,
        this.orthoNear,
        this.orthoFar
      )
    }
    else {
      projMatrix.setPerspective(
        this.perspectiveFieldOfView,
        this.perspectiveAspectRatio,
        this.perspectiveNear,
        this.perspectiveFar,
      )
    }
    return projMatrix;
  }

  private setupView() {
    const viewMatrix: Matrix4 = new Matrix4();
    viewMatrix.setLookAt(
      this.eyeX,
      this.eyeY,
      this.eyeZ,
      this.lookX,
      this.lookY,
      this.lookZ,
      this.upX,
      this.upY,
      this.upZ
    );
    return viewMatrix;

  }

  private setupRotation(): Matrix4 {
    let rotationMatrix = new Matrix4();
    rotationMatrix = rotationMatrix.rotate(this.rotateX, 1, 0, 0);
    rotationMatrix = rotationMatrix.rotate(this.rotateY, 0, 1, 0);
    rotationMatrix = rotationMatrix.rotate(this.rotateZ, 0, 0, 1);
    return rotationMatrix;
  }

  private setupTranslation(): Matrix4 {
    const translationMatrix = new Matrix4();
    translationMatrix.setTranslate(
      this.transX,
      this.transY,
      this.transZ
    );
    return translationMatrix;
  }

  private loadGLData(gl: any): number {
    const indexBuffer = gl.createBuffer();

    if (!indexBuffer) {
      console.log('No index buffer')
      return -1;
    }
    if (!WebGLUtil.initArrayBuffer(gl, 'a_Position', Constants.vertices, 3, gl.FLOAT)) return -1;
    if (!WebGLUtil.initArrayBuffer(gl, 'a_Normal', Constants.normals, 3, gl.FLOAT)) return -1;

    const translationMatrix = this.setupTranslation();
    const rotationMatrix = this.setupRotation();
    const viewMatrix = this.setupView();
    const projMatrix = this.setupProjection();

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const a_TriangleColor = gl.getAttribLocation(gl.program, 'a_TriangleColor');
    const u_PointColor = gl.getUniformLocation(gl.program, 'u_PointColor');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    const u_UseStaticColor = gl.getUniformLocation(gl.program, 'u_UseStaticColor');
    const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    const u_TranslationMatrix = gl.getUniformLocation(gl.program, 'u_TranslationMatrix');
    const u_RotationMatrix = gl.getUniformLocation(gl.program, 'u_RotationMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    if (this.entityType == Constants.POINT) {
      gl.uniform1i(u_UseStaticColor, true); // If rendering points, render single color
    }
    else {
      gl.uniform1i(u_UseStaticColor, false); // Otherwise, each fragment/face gets its own color
    }
    gl.uniform4fv(u_PointColor, Constants.pointColor.elements);
    gl.uniform3fv(u_LightColor, Constants.lightColor.elements);
    gl.uniform3f(u_LightDirection, this.lightX, this.lightY, this.lightZ);

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
    gl.uniformMatrix4fv(u_TranslationMatrix, false, translationMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.vertexAttrib1f(a_PointSize, Constants.pointSize);
    gl.vertexAttrib4fv(a_TriangleColor, Constants.triangleColor.elements);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Constants.indices, gl.STATIC_DRAW);

    return Constants.indices.length;
  }

  private logState() : void {
    console.log(this.projectionType);
    console.log(this.entityType);
    Constants.print();
}

}
