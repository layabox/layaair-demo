class CerberusModelShow{
	constructor(){
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Laya.Handler.create(this, function (scene) {
			Laya.stage.addChild(scene);
			scene.ambientMode = Laya.AmbientMode.SphericalHarmonics;

			var camera = scene.getChildByName("Main Camera");
			var moveScript = camera.addComponent(CameraMoveScript);
			moveScript.speed = 0.005;

			var size = 20;
			this.addText(size, Laya.stage.height - size * 2, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html");
		}));
	}
	
	/**
	 * add text.
	 */
	addText(size, y, text) {
		var cerberusText = new Laya.Text();
		cerberusText.color = "#FFFF00";
		cerberusText.fontSize = size;
		cerberusText.x = size;
		cerberusText.y = y;
		cerberusText.text = text;
		Laya.stage.addChild(cerberusText);
	}

}

//激活启动类
new CerberusModelShow();

    
