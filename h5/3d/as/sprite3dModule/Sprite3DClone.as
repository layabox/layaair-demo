package sprite3dModule {
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class Sprite3DClone {
		
		private var scene:Scene3D;
		
		public function Sprite3DClone() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			scene.ambientColor = new Vector3(1, 1, 1);
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			Laya.loader.create("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, onComplete));
		}
		
		public function onComplete():void {
			
			var layaMonkey:Sprite3D = scene.addChild(Loader.getRes("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Sprite3D;
			//克隆sprite3d
			var layaMonkey_clone1:Sprite3D = Sprite3D.instantiate(layaMonkey, scene, false, new Vector3(0.6, 0, 0));
			//克隆sprite3d
			var layaMonkey_clone2:Sprite3D = scene.addChild(Sprite3D.instantiate(layaMonkey, null, false, new Vector3( -0.6, 0, 0))) as Sprite3D;
		}
	}
}