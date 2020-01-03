/**
 * model rotation script.
 */
class RotationScript extends Laya.Script3D {
	constructor() {
		super();
		this._lastMouseX = 0.0;
		this._mouseDown = false;
		this._rotate = new Laya.Vector3();
		this.model = null;
		Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function () {
			this._mouseDown = true;
			this._lastMouseX = Laya.MouseManager.instance.mouseX;
		});
		Laya.stage.on(Laya.Event.MOUSE_UP, this, function () {
			this._mouseDown = false;
		});

	}
	onUpdate() {
		if (this._mouseDown) {
			var deltaX = Laya.MouseManager.instance.mouseX - this._lastMouseX;
			this._rotate.y = deltaX * 0.2;
			this.model.transform.rotate(this._rotate, false, false);
			this._lastMouseX = Laya.MouseManager.instance.mouseX;
		}
	}
}
class CerberusModelShow{
	constructor(){
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Laya.Handler.create(this, function (scene) {
			Laya.stage.addChild(scene);
			scene.ambientMode = Laya.AmbientMode.SphericalHarmonics;

			var model = scene.getChildByName("Cerberus_LP");
			var rotationScript = model.addComponent(RotationScript);
			rotationScript.model = model;

			var size = 20;
			this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
			size = 10;
			this.addText(size, Laya.stage.height - size * 4, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html", "#FFFF00");
		}));
	}
	
	/**
	 * add text.
	 */
	addText(size, y, text,color) {
		var cerberusText = new Laya.Text();
		cerberusText.color = color;
		cerberusText.fontSize = size * Laya.Browser.pixelRatio;
		cerberusText.x = size;
		cerberusText.y = y;
		cerberusText.text = text;
		Laya.stage.addChild(cerberusText);
	}

}

//激活启动类
new CerberusModelShow();

    
