package cameraModule {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.math.Viewport;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class MultiCamera {
		
		public function MultiCamera() {
			
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera1:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera1.clearColor = new Vector4(0.3, 0.3, 0.3, 1.0);
			camera1.transform.translate(new Vector3(0, 0, 1.5));
			camera1.normalizedViewport = new Viewport(0, 0, 0.5, 1.0);
			
			var camera2:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera2.clearColor = new Vector4(0.0, 0.0, 1.0, 1.0);
			camera2.transform.translate(new Vector3(0, 0, 1.5));
			camera2.normalizedViewport = new Viewport(0.5, 0.0, 0.5, 0.5);
			camera2.addComponent(CameraMoveScript);
			camera2.clearFlag = BaseCamera.CLEARFLAG_SKY;
			BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox2/skyBox2.lmat", Handler.create(null, function(mat:SkyBoxMaterial):void {
				camera2.skyboxMaterial = mat;
			}));
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			
			Sprite3D.load("../../../../res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(sp:Sprite3D):void {
				var layaMonkey:Sprite3D = scene.addChild(sp) as Sprite3D;
			}))
		
		}
	}
}
