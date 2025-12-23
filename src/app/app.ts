/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, signal } from '@angular/core';

import fragmentShaderSrc from '../assets/shaders/fragment-shader.glsl';
import vertexShaderSrc from '../assets/shaders/vertex-shader.glsl';
import { Constants, ModelChoice } from './constants';
import { Defaults } from './defaults';
import { Implementation } from './implementation';
import { GlUtil } from './lib/glUtil';
import { DrawingInfo, OBJDoc } from './lib/objDoc';
import { UiCallbacks } from './uiCallbacks';
import { Model } from './util/containers';
import { FormsModule } from '@angular/forms';
import { Version } from './version';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: [],
  imports: [FormsModule, Version],
})
export class App {
  // startup, spin control
  constructor() {
    this.handler.spin();
  }

  // This 2 fields make a very primitive Cheshire cat pattern to keep this file size smaller
  public handler = new UiCallbacks(this);
  public implementation = new Implementation(this);

  public init = false;
  public spinning = signal(true);
  public logging = signal(false);
  public gl: any = null;
  private shaderProgram: any = null;

  // Vertex data from stock obj files and uploaded files
  public models: Map<ModelChoice, Model> = new Map<ModelChoice, Model>();

  // Basic choices/toggles
  public pointStyleChoice = signal(Defaults.pointStyle);
  public modelChoice = signal(Defaults.modelChoice);
  public lightingType = signal(Defaults.lightingType);
  public entityType = signal(Defaults.entityType);
  public projectionType = signal(Defaults.projectionType);

  // Basic transforms
  public translate = signal(Defaults.translation);
  public rotation = signal(Defaults.rotation);
  public scale = signal(Defaults.scale);

  // View control
  public eye = signal(Defaults.eye);
  public up = signal(Defaults.up);
  public look = signal(Defaults.look);

  // Lighting positions
  public directionalLight = signal(Defaults.directionalLight);
  public pointLight = signal(Defaults.pointLight);

  // Projection parameters
  public ortho = signal(Defaults.ortho);
  public perspective = signal(Defaults.perspective);

  // GetWebGL context, load models, init shaders, and call start() to start rendering
  public initScreen() {
    if (!this.init) {
      this.init = true;
      this.gl = this.implementation.getContext();

      if (!this.gl) {
        throw Error('No WebGL context available.');
      }

      this.shaderProgram = GlUtil.createProgram(this.gl, vertexShaderSrc, fragmentShaderSrc);

      this.gl.useProgram(this.shaderProgram);
      this.gl.program = this.shaderProgram;

      fetch('models/nin.obj')
        .then((response) => response.text())
        .then((data) => {
          const parsedObj: OBJDoc = new OBJDoc('nin.obj');
          parsedObj.parse(data, 1, true);
          const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
          const nin: Model = new Model(
            drawingInfo.vertices,
            drawingInfo.normals,
            drawingInfo.indices,
            10,
          );
          this.models.set(ModelChoice.NineInchNails, nin);
        })
        .then(() => {
          fetch('models/rook.obj')
            .then((response) => response.text())
            .then((data) => {
              const parsedObj: OBJDoc = new OBJDoc('rook.obj');
              parsedObj.parse(data, 1, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              const rook: Model = new Model(
                drawingInfo.vertices,
                drawingInfo.normals,
                drawingInfo.indices,
                1.5,
              );
              this.models.set(ModelChoice.ChessRook, rook);
            });
        })
        .then(() => {
          fetch('models/box_hole.obj')
            .then((response) => response.text())
            .then((data) => {
              const parsedObj: OBJDoc = new OBJDoc('box_hole.obj');
              parsedObj.parse(data, 1, true);
              const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
              const cube: Model = new Model(
                drawingInfo.vertices,
                drawingInfo.normals,
                drawingInfo.indices,
                1.5,
              );
              this.models.set(ModelChoice.Cube, cube);
              this.start();
            });
        });
    }
  }

  // Set up data in WebGL context, call drawArrays/drawElements
  public start(frame = true): void {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    if (frame) {
      this.implementation.scaleCanvas();
    }
    const pointCount = this.implementation.loadGLData();
    if (pointCount <= 0) {
      return;
    }
    if (this.logging()) {
      this.implementation.logState();
    }

    if (this.entityType() == Constants.VERTEX) {
      gl.drawArrays(gl.POINTS, 0, pointCount);
    } else {
      gl.drawElements(gl.TRIANGLES, pointCount, gl.UNSIGNED_SHORT, 0);
    }
  }
}
