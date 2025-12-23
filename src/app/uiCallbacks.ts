import { App } from './app';
import { Constants, ModelChoice, PointStyle } from './constants';
import { DrawingInfo, OBJDoc } from './lib/objDoc';
import { Model, Triple, tripleUniform } from './util/containers';
import { getRecommendedScale } from './util/scale';

let globalApp: App;

// Used by main Angular AppComponent for button/input handlers
export class UiCallbacks {
  constructor(public app: App) {
    globalApp = this.app;
  }

  // Methods for setting the active model
  public setCubeModel() {
    this.app.modelChoice.set(ModelChoice.Cube);
    this.app.rotation.set(new Triple(0, this.app.rotation().y, this.app.rotation().z));
    this.app.scale.set(tripleUniform(1.5));
    this.app.start();
  }

  public setRookModel() {
    this.app.modelChoice.set(ModelChoice.ChessRook);
    this.app.rotation.set(new Triple(0, this.app.rotation().y, this.app.rotation().z));
    this.app.scale.set(tripleUniform(2));
    this.app.start();
  }

  public setNinModel() {
    this.app.modelChoice.set(ModelChoice.NineInchNails);
    this.app.rotation.set(new Triple(0, this.app.rotation().y, this.app.rotation().z));
    this.app.scale.set(tripleUniform(10));
    this.app.start();
  }

  public setUploadedModel() {
    this.app.modelChoice.set(ModelChoice.UploadedFile);
    this.app.rotation.set(new Triple(0, this.app.rotation().y, this.app.rotation().z));
    const model = this.app.models.get(ModelChoice.UploadedFile);
    if (model) {
      this.app.scale.set(tripleUniform(model.scale));
    }
  }

  // Methods for other basic controls
  public setPointLightMode() {
    this.app.lightingType.set(Constants.POINT_LIGHT);
    this.app.start();
  }

  public toggleSpinMode() {
    this.app.spinning.set(!this.app.spinning());
    this.spin();
  }

  public setDirectionalLightMode() {
    this.app.lightingType.set(Constants.DIRECTIONAL_LIGHT);
    this.app.start();
  }

  public setPointMode() {
    this.app.entityType.set(Constants.VERTEX);
    this.app.start();
  }

  public setSimplePointsMode() {
    this.app.pointStyleChoice.set(PointStyle.Simple);
    this.app.start();
  }

  public setFancyPointsMode() {
    this.app.pointStyleChoice.set(PointStyle.Fancy);
    this.app.start();
  }

  public setTriangleMode() {
    this.app.entityType.set(Constants.TRIANGLE);
    this.app.start();
  }

  public setOrthoMode() {
    this.app.projectionType.set(Constants.ORTHO);
    this.app.eye.set(new Triple(this.app.eye().x, this.app.eye().y, 1));
    this.app.start();
  }

  public setPerspectiveMode() {
    this.app.projectionType.set(Constants.PERSPECTIVE);
    this.app.eye.set(new Triple(this.app.eye().x, this.app.eye().y, 4.0));
    this.app.start();
  }

  // Handler for uploading model files
  public onFileSelected($event: Event) {
    const target = $event.target as HTMLInputElement;
    const file: File | null | undefined = target.files?.item(0);
    if (file) {
      file.text().then((data) => {
        const parsedObj: OBJDoc = new OBJDoc(file.name);
        parsedObj.parse(data, 1, true);
        const drawingInfo: DrawingInfo = parsedObj.getDrawingInfo();
        const uploaded = new Model(
          drawingInfo.vertices,
          drawingInfo.normals,
          drawingInfo.indices,
          getRecommendedScale(drawingInfo.vertices),
        );
        this.app.models.set(ModelChoice.UploadedFile, uploaded);
        this.app.modelChoice.set(ModelChoice.UploadedFile);
        this.app.scale.set(tripleUniform(uploaded.scale));
        this.app.start();
      });
    }
  }

  // Main animation loop
  public spin() {
    if (this.app.spinning()) {
      requestAnimationFrame(function () {
        globalApp.rotation.set(
          new Triple(globalApp.rotation().x, globalApp.rotation().y + 1, globalApp.rotation().z),
        );
        if (globalApp.rotation().y == 360) {
          globalApp.rotation.set(new Triple(globalApp.rotation().x, 0, globalApp.rotation().z));
        }
        globalApp.start(false);
        globalApp.handler.spin();
      });
    }
  }
}
