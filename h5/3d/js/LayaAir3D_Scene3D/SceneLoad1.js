class SceneLoad1{
	constructor(){
		Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Scene3D.load("res/threeDimen/scene/LayaScene_dudeScene/Conventional/dudeScene.ls", Laya.Handler.create(this, this.sceneLoadFinished));
	}
	sceneLoadFinished(scene){
		Laya.stage.addChild(scene);
        let camera = scene.getChildByName("Camera");
        camera.addComponent(CameraMoveScript);
	}
}

//激活启动类
new SceneLoad1();
