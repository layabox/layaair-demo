package sceneModule {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class SceneLoad2 {
		public function SceneLoad2() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("../../../../res/threeDimen/scene/TerrainScene/XunLongShi.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				camera.addComponent(CameraMoveScript);
				
				BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Handler.create(null, function(mat:BaseMaterial):void {
					camera.skyboxMaterial = mat;
				}));
				
				(scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
			}))
		
		}
	}
}