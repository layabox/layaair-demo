

/**
 * Light rotation script.
 */
class RotationScript extends Laya.Script3D {
    constructor() {
        super();
        this.autoRotateSpeed = new Laya.Vector3(0, 0.05, 0);;
        this.rotation = true;
	}

	onUpdate() {
		if (this.rotation)
			this.owner.transform.rotate(this.autoRotateSpeed, false);
	}
}

/**
 * Realtime shadow sample. 
 */
class RealTimeShadow {
	constructor() {
		//Init engine.
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//show stat.
		Laya.Stat.show();

		Laya.loader.create([
			"res/threeDimen/staticModel/grid/plane.lh",
			"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
		], Laya.Handler.create(this, this.onComplete));
	}

	onComplete() {
		var scene = Laya.stage.addChild(new Laya.Scene3D());

		var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
		camera.transform.translate(new Laya.Vector3(0, 1.2, 1.6));
		camera.transform.rotate(new Laya.Vector3(-35, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);

		var directionLight = scene.addChild(new Laya.DirectionLight());
		directionLight.color = new Laya.Vector3(0.85, 0.85, 0.8);
		directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));

		// Use soft shadow.
		directionLight.shadowMode = Laya.ShadowMode.SoftLow;
		// Set shadow max distance from camera.
		directionLight.shadowDistance = 3;
		// Set shadow resolution.
		directionLight.shadowResolution = 1024;
		// Set shadow cascade mode.
		directionLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;

		// Add rotation script to light.
		var rotationScript = directionLight.addComponent(RotationScript);

		// A plane receive shadow.
		var grid = scene.addChild(Laya.Loader.getRes("res/threeDimen/staticModel/grid/plane.lh"));
		grid.getChildAt(0).meshRenderer.receiveShadow = true;

		// A monkey cast shadow.
		var layaMonkey = scene.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
		layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
	    layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.castShadow = true;

		// A sphere cast/receive shadow.
		var sphereSprite = this.addPBRSphere(Laya.PrimitiveMesh.createSphere(0.1), new Laya.Vector3(0, 0.2, 0.5), scene);
		sphereSprite.meshRenderer.castShadow = true;
		sphereSprite.meshRenderer.receiveShadow = true;

		// Add Light controll UI.
		this.loadUI(rotationScript);
	}

	/**
	 * Add one with smoothness and metallic sphere.
	 */
	addPBRSphere(sphereMesh, position, scene) {
		var mat = new Laya.PBRStandardMaterial();
		mat.smoothness = 0.2;

		var meshSprite = new Laya.MeshSprite3D(sphereMesh);
		meshSprite.meshRenderer.sharedMaterial = mat;
		var transform = meshSprite.transform;
		transform.localPosition = position;
		scene.addChild(meshSprite);
		return meshSprite;
	}

	/**
	 * Add Button control light rotation.
	 */
	loadUI(rottaionScript) {
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
			var rotationButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", "Stop Rotation"));
			rotationButton.size(150, 30);
			rotationButton.labelSize = 20;
			rotationButton.sizeGrid = "4,4,4,4";
			rotationButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			rotationButton.pos(Laya.stage.width / 2 - rotationButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 40 * Laya.Browser.pixelRatio);
			rotationButton.on(Laya.Event.CLICK, this, function () {
				if (rottaionScript.rotation) {
					rotationButton.label = "Start Rotation";
					rottaionScript.rotation = false;
				} else {
					rotationButton.label = "Stop Rotation";
					rottaionScript.rotation = true;
				}
			});
		}));
	}
}

new RealTimeShadow();
