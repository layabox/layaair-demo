

class StaticBatchingTest {
	constructor() {
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//显示性能面板
		Laya.Stat.show();

		//预加载资源,该资源在Unity中已勾选Static后导出
		Laya.loader.create(["res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Laya.Handler.create(this, this.onComplete));
	}

	onComplete() {
		//加载场景
		var scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"));
		//添加相机
		var camera = scene.getChildByName("Main Camera");
		//相机添加视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);
	}

}

new StaticBatchingTest();


