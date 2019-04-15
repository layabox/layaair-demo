import CameraMoveScript from "./common/CameraMoveScript"
class PBRSpecularMaterialDeno {
	constructor() {
		Laya3D.init(0, 0);
		Laya.Stat.show();
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_Specular/Conventional/Specular.ls", Laya.Handler.create(this, function(scene:Laya.Scene3D):void {
			Laya.stage.addChild(scene) as Laya.Scene3D;
			var camera = scene.getChildByName("Main Camera") as Laya.Camera;
			camera.addComponent(CameraMoveScript);
		}));
	}
}
new PBRSpecularMaterialDeno();
