package advancedModule {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class PBRDemo {
		
		public function PBRDemo() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("../../../../res/threeDimen/scene/PBRScene/Demo.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				var camera:Camera = scene.getChildByName("Camera") as Camera;
				camera.addComponent(CameraMoveScript);
			}))
		}
	}
}