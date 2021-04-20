class GPUCompression_ETC2 {
	constructor() {
		Laya.Laya3D.init(0, 0);
		Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		var scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
		var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
		camera.transform.translate(new Laya.Vector3(0, 2, 5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
		let meshSprite = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox());
		this.mat = new Laya.UnlitMaterial();
		scene.addChild(meshSprite);
		meshSprite.meshRenderer.sharedMaterial = this.mat;
		if (!Laya.Browser.onAndroid) {
			console.log("只有安卓支持ETC");
			return;
		}
		Laya.Texture2D.load("res/threeDimen/texture/ETC2Test.ktx", Laya.Handler.create(this, function (texture) {
			this.mat.albedoTexture = texture;
		}));
	}
}
new GPUCompression_ETC2();