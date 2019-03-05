import CameraMoveScript from "./common/CameraMoveScript"
class Sky_Procedural{
	private directionLight:Laya.DirectionLight;
	private rotation:Laya.Vector3;
	constructor(){
						//初始化3D配置
			Laya.Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			
			//初始化3D场景
			var scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
			
			//初始化相机并设置清除标记为天空
			var camera:Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
			camera.addComponent(CameraMoveScript);
			camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
			
			//初始化平行光
			this.directionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
			this.directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
			this.rotation = new Laya.Vector3(-0.01, 0, 0);

			//初始化天空渲染器
			var skyRenderer:Laya.SkyRenderer= scene.skyRenderer;
			skyRenderer.mesh= Laya.SkyDome.instance;
			skyRenderer.material= new Laya.SkyProceduralMaterial();
			//旋转平行光,模拟太阳轨迹
			Laya.timer.frameLoop(1, this, this.onFrameLoop);
	}

	onFrameLoop(){
		this.directionLight.transform.rotate(this.rotation);
	}
}


//激活启动类
new Sky_Procedural;



