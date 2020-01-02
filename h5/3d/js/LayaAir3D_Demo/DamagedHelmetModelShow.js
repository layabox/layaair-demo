/**
 * model rotation script.
 */
class RotationScript extends Laya.Script3D {
	rotSpeed = new Laya.Vector3(0, 0.005, 0);
	onUpdate() {
		this.owner.transform.rotate(this.rotSpeed, false);
	}
}

class DamagedHelmetModelShow {

	constructor() {
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_DamagedHelmetScene/Conventional/DamagedHelmetScene.ls", Laya.Handler.create(this, function (scene) {
			Laya.stage.addChild(scene);

			var camera = scene.getChildByName("Main Camera");
			var moveScript = camera.addComponent(CameraMoveScript);
			moveScript.speed = 0.005;

			var damagedHelmet = scene.getChildAt(1).getChildAt(0);
			damagedHelmet.addComponent(RotationScript);

			var size = 20;
			this.addText(size, Laya.stage.height - size * 2, "Battle Damaged Sci-fi Helmet by theblueturtle_    www.leonardocarrion.com");
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

new DamagedHelmetModelShow();

