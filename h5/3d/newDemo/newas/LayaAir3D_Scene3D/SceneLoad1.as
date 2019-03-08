package OfficialExample.LayaAir3D_Scene {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class SceneLoad1 {
		public function SceneLoad1() {
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
		
			Scene3D.load("res/threeDimen/scene/LayaScene_dudeScene/Conventional/dudeScene.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Camera") as Camera;
				camera.addComponent(CameraMoveScript);
			}));
		
		}
	
	}
}