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
	
	public class CerberusModelShow {
		public function CerberusModelShow() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;

			Scene3D.load("res/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene);
				scene.ambientMode = AmbientMode.SphericalHarmonics;

				var camera = scene.getChildByName("Main Camera") as Camera;
				var moveScript = camera.addComponent(CameraMoveScript) as CameraMoveScript;
				moveScript.speed = 0.005;

				var size: number = 20;
				addText(size, Laya.stage.height - size * 2, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html");
			}));
		}
		
		/**
		 * add text.
		 */
		public function addText(size:Number, y:Number, text:String): void {
			var cerberusText: Text = new Text();
			cerberusText.color = "#FFFF00";
			cerberusText.fontSize = size;
			cerberusText.x = size;
			cerberusText.y = y;
			cerberusText.text = text;
			Laya.stage.addChild(cerberusText);
		}
	}
}