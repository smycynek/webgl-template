import { Component } from '@angular/core';

import trianglesFragmentShaderSrc from '../assets/shaders/trianglesFragmentShader.glsl';
import trianglesVertexShaderSrc from '../assets/shaders/trianglesVertexShader.glsl';

import pointsFragmentShaderSrc from '../assets/shaders/pointsFragmentShader.glsl';
import pointsVertexShaderSrc from '../assets/shaders/pointsVertexShader.glsl';

import { Constants, ModelChoice } from './constants';
import { Defaults } from './defaults';
import { GlUtil } from './lib/glUtil';
import { Matrix4 } from './lib/math';
import { DrawingInfo, OBJDoc } from './lib/objDoc';
import { Model, Ortho, Triple, tripleUniform } from './util/containers';
import { getRecommendedScale } from './util/scale';

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
  // startup, spin control
  public init = false;
  public spinning = true;
  public logging = false;
  private gl: any = null;
  private trianglesShaderProgram: any = null;
  private pointsShaderProgram: any = null;
  // Vertex data from stock obj files and uploaded files
  private models: Map<ModelChoice, Model> = new Map<ModelChoice, Model>();

  // Basic choices/toggles
  public modelChoice: ModelChoice = Defaults.modelChoice;
  public lightingType: string = Defaults.lightingType;
  public entityType: string = Defaults.entityType;
  public projectionType = Defaults.projectionType;

  // Basic transforms
  public translate: Triple = Defaults.translation;
  public rotation: Triple = Defaults.rotation;
  public scale: Triple = Defaults.scale;

  // View control
  public eye: Triple = Defaults.eye;
  public up: Triple = Defaults.up;
  public look: Triple = Defaults.look;

  // Lighting positions
  public directionalLight: Triple = Defaults.directionalLight;
  public pointLight: Triple = Defaults.pointLight;

  // Projection parameters
  public ortho: Ortho = Defaults.ortho;
  public perspective = Defaults.perspective;

  // Handler for uploading model files
  public onFileSelected($event: any) {
    const file: File = $event.target.files[0];
    if (file) {
      file.text().then(data => {
        const parsedObj: OBJDoc = new OBJDoc(file.name);
        parsedObj.parse(data, 1, true);
        const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
        const uploaded = new Model(drawingInfo.vertices, drawingInfo.normals, drawingInfo.indices, getRecommendedScale(drawingInfo.vertices));
        this.models.set(ModelChoice.UploadedFile, uploaded);
        this.modelChoice = ModelChoice.UploadedFile;
        this.scale = tripleUniform(uploaded.scale);
        this.start();
      });
    }
  }

  // Methods for setting the active model
  public setCubeModel() {
    this.modelChoice = ModelChoice.Cube;
    this.rotation.x = 0;
    this.scale = tripleUniform(1.5);
    this.start();
  }

  public setRookModel() {
    this.modelChoice = ModelChoice.ChessRook;
    this.rotation.x = 0;
    this.scale = tripleUniform(2);
    this.start();
  }

  public setNinModel() {
    this.modelChoice = ModelChoice.NineInchNails;
    this.rotation.x = 0;
    this.scale = tripleUniform(10);
    this.start();
  }

  public setUploadedModel() {
    this.modelChoice = ModelChoice.UploadedFile;
    this.rotation.x = 0;
    const model = this.models.get(ModelChoice.UploadedFile);
    if (model) {
      this.scale = tripleUniform(model.scale);
    }
  }

  // Methods for other basic controls
  public setPointLightMode() {
    this.lightingType = Constants.POINT_LIGHT;
    this.start();
  }

  public toggleSpinMode() {
    this.spinning = !this.spinning;
    this.spin();
  }

  public setDirectionalLightMode() {
    this.lightingType = Constants.DIRECTIONAL_LIGHT;
    this.start();
  }

  public setPointMode() {
    this.entityType = Constants.VERTEX;
    // const a_Position = this.gl.getAttribLocation(this.trianglesShaderProgram, 'a_Position');
    // this.gl.disableVertexAttribArray(a_Position);
    this.gl = this.getContext();
    this.gl.useProgram(this.pointsShaderProgram);
    this.gl.program = this.pointsShaderProgram;
    this.start();
  }

  public setTriangleMode() {
    this.entityType = Constants.TRIANGLE;
    // const a_Position = this.gl.getAttribLocation(this.pointsShaderProgram, 'a_Position');
    // this.gl.disableVertexAttribArray(a_Position);
    this.gl = this.getContext();
    this.gl.useProgram(this.trianglesShaderProgram);
    this.gl.program = this.trianglesShaderProgram;
    this.start();
  }

  public setOrthoMode() {
    this.projectionType = Constants.ORTHO;
    this.eye.z = 1;
    this.start();
  }

  public setPerspectiveMode() {
    this.projectionType = Constants.PERSPECTIVE;
    this.eye.z = 4.0;
    this.start();
  }

  public spin() {
    if (this.spinning) {
      requestAnimationFrame(function () {
        globalApp.rotation.y += 1;
        if (globalApp.rotation.y == 360) {
          globalApp.rotation.y = 0;
        }
        globalApp.start();
        globalApp.spin();
      });
    }
  }

  public initScreen() {
    if (!this.init) {
      this.init = true;
      this.gl = this.getContext();

      if (!this.gl) {
        throw Error('No WebGL context available.');
      }

      const canvas = this.getCanvas();
      if (canvas && canvas instanceof HTMLCanvasElement) {
        this.scaleCanvas(canvas);
      }

      this.trianglesShaderProgram = GlUtil.createProgram(this.gl, trianglesVertexShaderSrc, trianglesFragmentShaderSrc);
      this.pointsShaderProgram = GlUtil.createProgram(this.gl, pointsVertexShaderSrc, pointsFragmentShaderSrc);

      this.gl.useProgram(this.trianglesShaderProgram);
      this.gl.program = this.trianglesShaderProgram;

      fetch('assets/nin.obj')
        .then(response => response.text())
        .then(data => {
          const parsedObj: OBJDoc = new OBJDoc('nin.obj');
          parsedObj.parse(data, 1, true);
          const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
          const nin: Model = new Model(drawingInfo.vertices, drawingInfo.normals, drawingInfo.indices, 10);
          this.models.set(ModelChoice.NineInchNails, nin);
        }).then(() => {
          fetch('assets/rook.obj')
            .then(response => response.text())
            .then(data => {
              const parsedObj: OBJDoc = new OBJDoc('rook.obj');
              parsedObj.parse(data, 1, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              const rook: Model = new Model(drawingInfo.vertices, drawingInfo.normals, drawingInfo.indices, 1.5);
              this.models.set(ModelChoice.ChessRook, rook);
            });
        }).then(() => {
          fetch('assets/cube.obj')
            .then(response => response.text())
            .then(data => {
              const parsedObj: OBJDoc = new OBJDoc('cube.obj');
              parsedObj.parse(data, 1, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              const cube: Model = new Model(drawingInfo.vertices, drawingInfo.normals, drawingInfo.indices, 1.5);
              this.models.set(ModelChoice.Cube, cube);
              this.start();
            });
        });
    }
  }

  public start(): void {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);


    const pointCount = this.loadGLData(gl);
    if (pointCount <= 0) {
      return;
    }
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

  public onResize($event: any) {
    const canvas = this.getCanvas();
    if (canvas && canvas instanceof HTMLCanvasElement) {
      this.scaleCanvas(canvas);
    }
  }

  private scaleCanvas(canvas: HTMLCanvasElement): void {
    if (this.gl) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }
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
        this.ortho.left,
        this.ortho.right,
        this.ortho.bottom,
        this.ortho.top,
        this.ortho.near,
        this.ortho.far,
      );
    }
    else {
      projMatrix.setPerspective(
        this.perspective.fieldOfView,
        this.perspective.aspectRatio,
        this.perspective.near,
        this.perspective.far,
      );
    }
    return projMatrix;
  }

  private setupView() {
    const viewMatrix: Matrix4 = new Matrix4();
    viewMatrix.setLookAt(
      this.eye.x,
      this.eye.y,
      this.eye.z,
      this.look.x,
      this.look.y,
      this.look.z,
      this.up.x,
      this.up.y,
      this.up.z
    );
    return viewMatrix;

  }

  private setupRotation(): Matrix4 {
    let rotationMatrix = new Matrix4();
    rotationMatrix = rotationMatrix.rotate(this.rotation.x, 1, 0, 0);
    rotationMatrix = rotationMatrix.rotate(this.rotation.y, 0, 1, 0);
    rotationMatrix = rotationMatrix.rotate(this.rotation.z, 0, 0, 1);
    return rotationMatrix;
  }

  private setupTranslation(): Matrix4 {
    const translationMatrix = new Matrix4();
    translationMatrix.setTranslate(
      this.translate.x, this.translate.y, this.translate.z
    );
    return translationMatrix;
  }

  private setupScale(): Matrix4 {
    const scaleMatrix = new Matrix4();
    scaleMatrix.setScale(
      this.scale.x,
      this.scale.y,
      this.scale.z
    );
    return scaleMatrix;
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

    const model = this.models.get(this.modelChoice);
    if (model) {
      vertices = model.vertices;
      normals = model.normals;
      indices = model.indices;
    } else {
      return 0; // model not loaded yet;
    }

    if (!GlUtil.initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (this.entityType == Constants.VERTEX) {
      const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
      const u_PointColor1 = gl.getUniformLocation(gl.program, 'u_PointColor1');
      const u_PointColor2 = gl.getUniformLocation(gl.program, 'u_PointColor2');
      gl.uniform4fv(u_PointColor1, Constants.pointColor1.elements);
      gl.uniform4fv(u_PointColor2, Constants.pointColor2.elements);
      gl.vertexAttrib1f(a_PointSize, Constants.pointSize);
    }

    if (this.entityType == Constants.TRIANGLE) {
      if (!GlUtil.initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
      const a_TriangleColor = gl.getAttribLocation(gl.program, 'a_TriangleColor');
      const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_UseDirectionalLight = gl.getUniformLocation(gl.program, 'u_UseDirectionalLight');
      const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
      const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
      gl.vertexAttrib4fv(a_TriangleColor, Constants.triangleColor.elements);
      if (this.lightingType == Constants.DIRECTIONAL_LIGHT) {
        gl.uniform1i(u_UseDirectionalLight, true);
      } else {
        gl.uniform1i(u_UseDirectionalLight, false);
      }
      gl.uniform3fv(u_LightColor, Constants.lightColor.elements);
      gl.uniform3f(u_LightDirection, this.directionalLight.x, this.directionalLight.y, this.directionalLight.z);
      gl.uniform3f(u_LightPosition, this.pointLight.x, this.pointLight.y, this.pointLight.z);
    }

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    gl.uniformMatrix4fv(u_ViewMatrix, false, this.setupView().elements);
    const modelMatrix = this.setupTranslation().concat(this.setupRotation()).concat(this.setupScale());
    const normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, this.setupProjection().elements);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices ? indices.length : 0;
  }

  private logState(): void {
    console.log(this.projectionType);
    console.log(this.entityType);
    console.log(this.lightingType);
    Constants.print();
  }
}
