package LayaAir3D_Scene3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class LightmapScene {
		
		public function LightmapScene() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("res/threeDimen/scene/ParticleScene/Example_01.ls", Handler.create(null, function(sprite:Scene3D):void {
				var scene:Scene3D = Laya.stage.addChild(sprite) as Scene3D;
				var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
				camera.transform.translate(new Vector3(0, 1, 0));
				camera.addComponent(CameraMoveScript);
			}));
		
		}
	
	}

}