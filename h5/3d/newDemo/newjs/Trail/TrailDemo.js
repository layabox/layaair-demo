
class TrailDemo 
{
	constructor() 
	{
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		//加载拖尾示例效果
		Laya.Scene3D.load("res/threeDimen/TrailTest/Trail.ls", Laya.Handler.create(this, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
			var directionLight = new Laya.DirectionLight();
			scene.addChild(directionLight);
			directionLight.color = new Laya.Vector3(1, 1, 1);
			directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));
		}));

	}	
}
//启动激活类
new TrailDemo;