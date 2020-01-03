package {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.AmbientMode;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Scene;
	import laya.display.Stage;
	import laya.display.Text;
	import laya.net.AtlasInfoManager;
	import laya.net.ResourceVersion;
	import laya.net.URL;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Utils;
	import laya.d3.component.Script3D;
	import laya.d3.math.Vector3;
	import laya.events.Event;
	import laya.events.MouseManager;
	import laya.utils.Browser;
	import laya.d3.core.Sprite3D;



	public class CerberusModelShow {
		public function CerberusModelShow() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;

			Scene3D.load("res/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene);
				scene.ambientMode = AmbientMode.SphericalHarmonics;

				var model: Sprite3D = scene.getChildByName("Cerberus_LP") as Sprite3D;
				var rotationScript: RotationScript = model.addComponent(RotationScript);
				rotationScript.model = model;

				var size: Number = 20;
				addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
				size = 10;
				addText(size, Laya.stage.height - size * 4, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html", "#FFFF00");
			}));
		}
		
		/**
		 * add text.
		 */
		public function addText(size:Number, y:Number, text:String,color:String): void {
			var cerberusText: Text = new Text();
			cerberusText.color = color;
			cerberusText.fontSize = size * Browser.pixelRatio;
			cerberusText.x = size;
			cerberusText.y = y;
			cerberusText.text = text;
			Laya.stage.addChild(cerberusText);
		}
	}
}


/**
 * model rotation script.
 */
class RotationScript extends Script3D {
	private  var _lastMouseX: Number;
	private var _mouseDown: Boolean = false;
	private var _rotate: Vector3 = new Vector3();

	model: Sprite3D;

	public function  RotationScript() {
		super();
		Laya.stage.on(Event.MOUSE_DOWN, this, function (): void {
			this._mouseDown = true;
			this._lastMouseX = MouseManager.instance.mouseX;
		});
		Laya.stage.on(Event.MOUSE_UP, this, function (): void {
			this._mouseDown = false;
		});

	}
	override public function onUpdate():void {
		if (this._mouseDown) {
			var deltaX: Number = MouseManager.instance.mouseX - this._lastMouseX;
			this._rotate.y = deltaX * 0.2;
			this.model.transform.rotate(this._rotate, false, false);
			this._lastMouseX = MouseManager.instance.mouseX;
		}
	}
}









