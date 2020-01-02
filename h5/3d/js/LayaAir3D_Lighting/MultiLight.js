class LightMoveScript extends Laya.Script3D {
	constructor() {
		super();
		this.forward = new Laya.Vector3();
		this.lights = [];
		this.offsets = [];
		this.moveRanges= [];
	}

	onUpdate() {
		var seed = Laya.timer.currTimer * 0.002;
		for (var i = 0, n = this.lights.length; i < n; i++) {
			var transform = this.lights[i].transform;
			var pos = transform.localPosition;
			var off = this.offsets[i];
			var ran = this.moveRanges[i];
			pos.x = off.x + Math.sin(seed) * ran.x;
			pos.y = off.y + Math.sin(seed) * ran.y;
			pos.z = off.z + Math.sin(seed) * ran.z;
			transform.localPosition = pos;
		}
	}
}

class MultiLight {

	constructor() {
		//设置场景中光源的最大数量
		var c = new Config3D();
		c.maxLightCount = 16;
		Laya3D.init(0, 0, c);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();

		Laya.Scene3D.load("res/threeDimen/scene/MultiLightScene/InventoryScene_Forest.ls", Laya.Handler.create(this, function (scene) {
			Laya.stage.addChild(scene);

			var camera = scene.getChildByName("Main Camera");
			camera.addComponent(CameraMoveScript);
			camera.transform.localPosition = new Laya.Vector3(8.937199060699333, 61.364798067809126, -66.77836086472654);
			var moveScript = camera.addComponent(LightMoveScript);
			moveScript.forward = new Laya.Vector3();
			moveScript.lights = [];
			moveScript.offsets = [];
			moveScript.moveRanges = [];
			var moverLights = moveScript.lights;
			var offsets = moveScript.offsets;
			var moveRanges = moveScript.moveRanges;
			moverLights.length = 15;
			for (var i = 0; i < 15; i++) {
				var pointLight = scene.addChild(new Laya.PointLight());
				pointLight.range = 2.0 + Math.random() * 8.0;
				pointLight.color.setValue(Math.random(), Math.random(), Math.random());
				pointLight.intensity = 2.0 + Math.random() * 8;
				moverLights[i] = pointLight;
				offsets[i] = new Laya.Vector3((Math.random() - 0.5) * 20, pointLight.range * 0.75, 20.0 * Math.random() - 10);
				moveRanges[i] = new Laya.Vector3((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
			}


			var spotLight = scene.addChild(new Laya.SpotLight());
			spotLight.transform.localPosition = new Laya.Vector3(0.0, 9.0, -35.0);
			spotLight.transform.localRotationEuler = new Laya.Vector3(-15.0, 180.0, 0.0);
			spotLight.color.setValue(Math.random(), Math.random(), Math.random());
			spotLight.range = 50;
			spotLight.intensity = 15;
			spotLight.spotAngle = 70;

		}));

	}
}

new MultiLight();

