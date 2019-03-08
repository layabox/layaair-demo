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
	import laya.d3.math.Vector3;
	
	public class SceneLoad2 {
		public function SceneLoad2() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				//开启雾化效果
				scene.enableFog = true;
				//设置雾化的颜色
				scene.fogColor = new Vector3(0,0,0.6);
				//设置雾化的起始位置，相对于相机的距离
				scene.fogStart = 10;
				//设置雾化最浓处的距离。
				scene.fogRange = 40;
				scene.ambientColor = new Vector3(0.6,0,0);
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				camera.addComponent(CameraMoveScript);
				
				BaseMaterial.load("res/threeDimen/skyBox/skyBox3/skyBox3.lmat", Handler.create(null, function(mat:BaseMaterial):void {
					camera.skyboxMaterial = mat;
				}));
				
				(scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
			}))
		
		}
	}
}