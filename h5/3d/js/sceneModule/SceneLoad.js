class SceneLoad{
	constructor(){
		Laya3D.init(0, 0);
        Laya.Stat.show();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Scene3D.load("res/threeDimen/scene/HydropowerScene/main_scene.ls", Laya.Handler.create(null, this.sceneLoadFinished));
	}
	sceneLoadFinished(scene){
		Laya.stage.addChild(scene);
        var camera = scene.getChildByName("Main Camera");
        camera.addComponent(CameraMoveScript);
	}
}

//激活启动类
new SceneLoad();
