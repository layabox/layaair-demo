package LayaAir3D_Lighting 
{
    import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.component.Script3D;
	import laya.d3.core.light.PointLight;
	import laya.d3.core.light.SpotLight;
	public class MultiLight 
	{
		
		public function MultiLight() 
		{
			//在Config3D中配置引擎所能接纳的最大光源的数量
			var c = new Config3D();
			c.maxLightCount = 16;
			//初始化引擎
			Laya3D.init(0, 0, c);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();

			Scene3D.load("res/MultiLightScene/InventoryScene_Forest.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene);

				var camera: Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				camera.transform.localPosition = new Vector3(8.937199060699333, 61.364798067809126, -66.77836086472654);
				var moveScript: LightMoveScript = camera.addComponent(LightMoveScript);
				var moverLights= moveScript.lights;
				var offsets = moveScript.offsets;
				var moveRanges = moveScript.moveRanges;
				moverLights.length = 15;
				for (var i: number = 0; i < 15; i++) {
					//添加点光源，和原来的添加点光源方式无异
					var pointLight: PointLight = scene.addChild(new PointLight()) as PointLight;
					pointLight.range = 2.0 + Math.random() * 8.0;
					pointLight.color.setValue(Math.random(), Math.random(), Math.random());
					pointLight.intensity = 6.0 + Math.random() * 8;
					moverLights[i] = pointLight;
					offsets[i] = new Vector3((Math.random() - 0.5) * 10, pointLight.range * 0.75, (Math.random() - 0.5) * 10);
					moveRanges[i] = new Vector3((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
				}
				//添加一个聚光灯，和原来的添加聚光灯方式无异
				var spotLight: SpotLight = scene.addChild(new SpotLight()) as SpotLight;
				spotLight.transform.localPosition = new Vector3(0.0, 9.0, -35.0);
				spotLight.transform.localRotationEuler = new Vector3(-15.0, 180.0, 0.0);
				spotLight.color.setValue(Math.random(), Math.random(), Math.random());
				spotLight.range = 50;
				spotLight.intensity = 15;
				spotLight.spotAngle = 60;

			}));
		}
		
	}




//自定义一个灯光位置自动变换的脚本
class LightMoveScript extends Script3D {

		private var forward: Vector3 = new Vector3();
		private var lights: Vector.<LightSprite> = new Vector.<LightSprite>();
		private var lights: Vector.<LightSprite> = new Vector.<LightSprite>();
		private var offsets: Vector.<Vector3> = new Vector.<Vector3>();
		private var moveRanges: Vector.<Vector3> = new Vector.<Vector3>();
		
		override public function onUpdate():void {
			var seed: number = Laya.timer.currTimer * 0.002;
			for (var i: number = 0, n: number = this.lights.length; i < n; i++) {
				var transform: Transform3D = this.lights[i].transform;
				var pos: Vector3 = transform.localPosition;
				var off: Vector3 = this.offsets[i];
				var ran: Vector3 = this.moveRanges[i];
				pos.x = off.x + Math.sin(seed) * ran.x;
				pos.y = off.y + Math.sin(seed) * ran.y;
				pos.z = off.z + Math.sin(seed) * ran.z;
				transform.localPosition = pos;
			}
		}
	}

}