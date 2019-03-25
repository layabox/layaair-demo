package LayaAir3D_Scene3D {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class SceneLoad2 {
		public function SceneLoad2() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			Scene3D.load("res/threeDimen/scene/TerrainScene/XunLongShi.ls", Handler.create(null, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				//开启雾化效果
				scene.enableFog = true;
				//设置雾化的颜色
				scene.fogColor = new Vector3(0, 0, 0.6);
				//设置雾化的起始位置，相对于相机的距离
				scene.fogStart = 10;
				//设置雾化最浓处的距离。
				scene.fogRange = 40;
				//设置场景环境光
				scene.ambientColor = new Vector3(0.6, 0, 0);
				
				//获取场景中的相机
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				//设置相机横纵比
				camera.aspectRatio = 0;
				//设置相机近距裁剪
				camera.nearPlane = 0.1;
				//设置相机远距裁剪
				camera.farPlane = 1000;
				//相机设置清楚标记
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				//设置摄像机视野范围（角度）
				camera.fieldOfView = 60;
				//设置背景颜色
				//camera.clearColor = new Vector4(0,0,0.6,1);    
				//加入摄像机移动控制脚本
				camera.addComponent(CameraMoveScript);
				
				//加载相机天空盒材质
				BaseMaterial.load("../../../../res/threeDimen/skyBox/skyBox3/SkyBox.lmat", Handler.create(null, function(mat:BaseMaterial):void {
					var skyRenderer:SkyRenderer = camera.skyRenderer;
					skyRenderer.mesh = SkyBox.instance;
					skyRenderer.material = mat;
				}));
				
				//创建方向光
				var light:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
				//移动灯光位置
				light.transform.translate(new Vector3(0, 2, 5));
				//调整灯光方向
				light.transform.worldMatrix.setForward(new Vector3(0, -5, 1));
				//设置灯光漫反射颜色
				light.diffuseColor = new Vector3(0.3, 0.3, 0.3);
				
				//激活场景中的两个子节点
				(scene.getChildByName('Scenes').getChildByName('HeightMap') as MeshSprite3D).active = false;
				(scene.getChildByName('Scenes').getChildByName('Area') as MeshSprite3D).active = false;
			}));
		
		}
	}
}