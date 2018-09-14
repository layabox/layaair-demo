package skyModule {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	
	public class SkyBoxSample1 {
		
		public function SkyBoxSample1() {
			
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.rotate(new Vector3(10, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			
			//天空盒
			BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox1/skyBox.lmat", Handler.create(null, function(mat:SkyBoxMaterial):void {
				camera.skyboxMaterial = mat;
				Laya.timer.frameLoop(1, this, function():void {
					mat.rotation += 0.1;
				});
			}));
		
		}
	}
}