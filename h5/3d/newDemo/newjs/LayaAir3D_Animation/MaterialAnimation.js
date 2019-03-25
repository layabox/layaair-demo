class MaterialAnimation {
	constructor() {
		Laya3D.init(0, 0);
		Laya.Stat.show();
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		
		Laya.Scene3D.load("res/threeDimen/scene/materialScene/Conventional/layaScene.ls", Laya.Handler.create(this, function(scene) {
			Laya.stage.addChild(scene);
			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
		}));	
		
	}
	
}
new MaterialAnimation;