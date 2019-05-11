package LayaAir3D_Animation3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class CameraAnimation {
		public function CameraAnimation() {
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			Scene3D.load("res/threeDimen/scene/cameraDonghua/Conventional/layaScene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
			}));
		
		}
	
	}
}