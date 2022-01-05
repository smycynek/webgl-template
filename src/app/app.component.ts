import { Component } from '@angular/core';

import fragmentShaderSrc from '../assets/shaders/fragment-shader.glsl';
import vertexShaderSrc from '../assets/shaders/vertex-shader.glsl';
import { Constants, ModelChoice } from './resources/constants';
import { Defaults } from './resources/defaults';
import { GlUtil } from './util/glUtil';
import { Matrix4 } from './util/math';
import { DrawingInfo, OBJDoc } from './util/objDoc';

let globalApp: AppComponent;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.template.html',
  styles: []
})
export class AppComponent {
  constructor() {
    globalApp = this;
    this.spin();
  }
  public modelChoice: ModelChoice = Defaults.modelChoice;
  public init = false;
  public directionalLightX: number = Defaults.directionalLightX;
  public directionalLightY: number = Defaults.directionalLightY;
  public directionalLightZ: number = Defaults.directionalLightZ;
  public pointLightX: number = Defaults.pointLightX;
  public pointLightY: number = Defaults.pointLightY;
  public pointLightZ: number = Defaults.pointLightZ;
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
  public lightingType: string = Defaults.lightingType;
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
  public title = 'WebGL Angular/TypeScript/Webpack Template';
  public spinning = true;
  public logging = false;

  private ninVertices: Float32Array = new Float32Array([]);
  private ninNormals: Float32Array = new Float32Array([]);
  private ninIndices: Uint16Array = new Uint16Array([]);

  private rookVertices: Float32Array = new Float32Array([]);
  private rookNormals: Float32Array = new Float32Array([]);
  private rookIndices: Uint16Array = new Uint16Array([]);

  private cubeVertices: Float32Array = new Float32Array([]);
  private cubeNormals: Float32Array = new Float32Array([]);
  private cubeIndicies: Uint16Array = new Uint16Array([]);

  public setCubeModel() {
    this.modelChoice = ModelChoice.Cube;
    this.rotateX = 0;
    this.start();
  }

  public setRookModel() {
    this.modelChoice = ModelChoice.ChessRook;
    this.rotateX = 90;
    this.start();
  }

  public setNinModel() {
    this.modelChoice = ModelChoice.NineInchNails;
    this.rotateX = 0;
    this.start();
  }

  public setPointLightMode() {
    this.lightingType = Constants.POINT_LIGHT;
    this.start();
  }

  public toggleSpinMode() {
    this.spinning = !this.spinning;
    this.spin();
  }

  public spin() {
    if (this.spinning) {
      requestAnimationFrame(function () {
        globalApp.rotateY += 1;
        if (globalApp.rotateY == 360) {
          globalApp.rotateY = 0;
        }
        globalApp.start();
        globalApp.spin();
      });
    }
  }

  public setDirectionalLightMode() {
    this.lightingType = Constants.DIRECTIONAL_LIGHT;
    this.start();
  }
  public setPointMode() {
    this.entityType = Constants.VERTEX;
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
      this.init = true;
      fetch('assets/nin.obj')
        .then(response => response.text())
        .then(data => {
          const parsedObj: OBJDoc = new OBJDoc('nin.obj');
          parsedObj.parse(data, 10, true);
          const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
          this.ninVertices = drawingInfo.vertices;
          this.ninNormals = drawingInfo.normals;
          this.ninIndices = drawingInfo.indices;
        }).then(() => {
          fetch('assets/rook.obj')
            .then(response => response.text())
            .then(data => {
              const parsedObj: OBJDoc = new OBJDoc('rook.obj');
              parsedObj.parse(data, 1.5, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              this.rookVertices = drawingInfo.vertices;
              this.rookNormals = drawingInfo.normals;
              this.rookIndices = drawingInfo.indices;
            });
        }).then(() => {
          fetch('assets/cube.obj')
            .then(response => response.text())
            .then(data => {
              const parsedObj: OBJDoc = new OBJDoc('cube.obj');
              parsedObj.parse(data, 2, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              this.cubeVertices = drawingInfo.vertices;
              this.cubeNormals = drawingInfo.normals;
              this.cubeIndicies = drawingInfo.indices;
              this.start();
            });
        });
    }
  }

  public start(): void {
    const gl = this.getContext();
    if (!gl) {
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    GlUtil.initShaders(gl, vertexShaderSrc, fragmentShaderSrc);

    const pointCount = this.loadGLData(gl);
    if (this.logging) {
      this.logState();
    }

    if (this.entityType == Constants.VERTEX) {
      gl.drawArrays(gl.POINTS, 0, pointCount);
    }
    else {

      gl.drawElements(gl.TRIANGLES, pointCount, gl.UNSIGNED_SHORT, 0);
    }
  }

  private getCanvas(): HTMLElement | null {
    const canvas: HTMLElement | null = document.getElementById('gl_canvas');
    if (!canvas) {
      console.log('Failed to get canvas');
      return null;
    }
    return canvas;
  }

  private getContext(): any | null {
    let gl;

    const canvas = this.getCanvas();
    if (!canvas) {
      console.log('Failed to get canvas');
      return null;
    }
    if (canvas instanceof HTMLCanvasElement) {
      // Get the rendering context for WebGL
      gl = canvas.getContext('webgl');
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
      );
    }
    else {
      projMatrix.setPerspective(
        this.perspectiveFieldOfView,
        this.perspectiveAspectRatio,
        this.perspectiveNear,
        this.perspectiveFar,
      );
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
      console.log('No index buffer');
      return -1;
    }
    let vertices: Float32Array;
    let normals: Float32Array;
    let indices: Uint16Array;

    if (this.modelChoice == ModelChoice.NineInchNails) {
      vertices = this.ninVertices;
      normals = this.ninNormals;
      indices = this.ninIndices;
    } else if (this.modelChoice == ModelChoice.ChessRook)  {
      vertices = this.rookVertices;
      normals = this.rookNormals;
      indices = this.rookIndices;
    }
    else {
      vertices = this.cubeVertices;
      normals = this.cubeNormals;
      indices = this.cubeIndicies;
    }

    if (!GlUtil.initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!GlUtil.initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    const translationMatrix = this.setupTranslation();
    const rotationMatrix = this.setupRotation();
    const viewMatrix = this.setupView();
    const projMatrix = this.setupProjection();

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const a_TriangleColor = gl.getAttribLocation(gl.program, 'a_TriangleColor');
    const u_PointColor = gl.getUniformLocation(gl.program, 'u_PointColor');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    const u_UseStaticColor = gl.getUniformLocation(gl.program, 'u_UseStaticColor');
    const u_UseDirectionalLight = gl.getUniformLocation(gl.program, 'u_UseDirectionalLight');
    const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    const u_TranslationMatrix = gl.getUniformLocation(gl.program, 'u_TranslationMatrix');
    const u_RotationMatrix = gl.getUniformLocation(gl.program, 'u_RotationMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    if (this.entityType == Constants.VERTEX) {
      gl.uniform1i(u_UseStaticColor, true); // If rendering points, render single color
    }
    else {
      gl.uniform1i(u_UseStaticColor, false); // Otherwise, each fragment/face gets its own color
    }

    if (this.lightingType == Constants.DIRECTIONAL_LIGHT) {
      gl.uniform1i(u_UseDirectionalLight, true);
    } else {
      gl.uniform1i(u_UseDirectionalLight, false);
    }

    gl.uniform4fv(u_PointColor, Constants.pointColor.elements);
    gl.uniform3fv(u_LightColor, Constants.lightColor.elements);
    gl.uniform3f(u_LightDirection, this.directionalLightX, this.directionalLightY, this.directionalLightZ);
    gl.uniform3f(u_LightPosition, this.pointLightX, this.pointLightY, this.pointLightZ);

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
    gl.uniformMatrix4fv(u_TranslationMatrix, false, translationMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.vertexAttrib1f(a_PointSize, Constants.pointSize);
    gl.vertexAttrib4fv(a_TriangleColor, Constants.triangleColor.elements);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
  }

  private logState(): void {
    console.log(this.projectionType);
    console.log(this.entityType);
    console.log(this.lightingType);
    Constants.print();
  }
}
