package {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.display.Stage;
	import laya.d3.core.Sprite3D;
	import laya.d3.math.Vector3;
	import laya.display.Text;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.core.scene.Scene3D;



	public class DamagedHelmetModelShow {

		
		public function DamagedHelmetModelShow() {
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;

			Scene3D.load("res/LayaScene_DamagedHelmetScene/Conventional/DamagedHelmetScene.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene);

				var damagedHelmet: MeshSprite3D = scene.getChildAt(1).getChildAt(0) as MeshSprite3D;
				var rotationScript: RotationScript = damagedHelmet.addComponent(RotationScript);
				rotationScript.model = damagedHelmet;

				var size: Number = 20;
				this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
				size = 10;
				this.addText(size, Laya.stage.height - size * 4, "Battle Damaged Sci-fi Helmet by theblueturtle_    www.leonardocarrion.com", "#FFFF00");
			}));
		}
		
		/**
		 * add text.
		 */
		public function addText(size:Number, y: Number, text: String, color: String): void {
			var cerberusText:Text = new Text();
			cerberusText.color = color;
			cerberusText.fontSize = size;
			cerberusText.x = size;
			cerberusText.y = y;
			cerberusText.text = text;
			Laya.stage.addChild(cerberusText);
		}
		

	}
	

}


import laya.d3.component.Script3D;
import laya.d3.math.Vector3;
import laya.events.Event;
import laya.events.MouseManager;
/**
 * model rotation script.
 */
class RotationScript extends Script3D {
	private var rotSpeed: Vector3 = new Vector3(0, 0.005, 0);
	private var _lastMouseX: Number;
	private var _mouseDown: Boolean = false;
	private var _rotate: Vector3 = new Vector3();
	private var _autoRotateSpeed: Vector3 = new Vector3(0, 0.25, 0);

	private var model: Sprite3D;

	public function RotationScript() {
		super();
		Laya.stage.on(Event.MOUSE_DOWN, this, function (): void {
			this._mouseDown = true;
			this._lastMouseX = MouseManager.instance.mouseX;
		});
		Laya.stage.on(Event.MOUSE_UP, this, function (): void {
			this._mouseDown = false;
		});
	}
	override public function onUpdate(): void {
		if (this._mouseDown) {
			var deltaX: Number = MouseManager.instance.mouseX - this._lastMouseX;
			this._rotate.y = deltaX * 0.2;
			this.model.transform.rotate(this._rotate, false, false);
			this._lastMouseX = MouseManager.instance.mouseX;
		}
		else {
			this.model.transform.rotate(this._autoRotateSpeed, false, false);
		}
	}
}

