// import CameraMoveScript from "./script/CameraMoveScript"
class LoadGltfRosource {
	constructor() {
		Laya.Laya3D.init(0, 0);
		Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		Laya.Shader3D.debugMode = true;
		this.scene = Laya.Laya.stage.addChild(new Laya.Scene3D());
		this.camera = this.scene.addChild(new Laya.Camera());
		//this.camera.addComponent(CameraMoveScript);
		this.camera.transform.position = new Laya.Vector3(0, 1, 7);
		var directionLight = this.scene.addChild(new Laya.DirectionLight());
		directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix = mat;
		Laya.Laya.loader.create("res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls", Laya.Handler.create(this, function () {
			this.scene.ambientColor = new Laya.Vector3(0.858, 0.858, 0.858);
			this.scene.reflection = Laya.Loader.getRes("res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls");
			this.scene.reflectionDecodingFormat = 1;
			this.scene.reflectionIntensity = 1;
		}));
		var gltfResource = [
			{ url: "res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf", type: Laya.Loader.JSON },
			{ url: "res/threeDimen/gltf/Duck/Duck.gltf", type: Laya.Loader.JSON },
			{ url: "res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf", type: Laya.Loader.JSON },
		];
		var gltfLoader = new Laya.GLTFLoader();
		gltfLoader.loadGLTF(gltfResource, Laya.Handler.create(this, this.onGLTFComplate));
	}
	onGLTFComplate(success) {
		if (!success) {
			console.log("gltf load failed");
			return;
		}
		var RiggedFigure = Laya.GLTFLoader.getRes("res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf");
		this.scene.addChild(RiggedFigure);
		RiggedFigure.transform.position = new Laya.Vector3(-2, 0, 0);
		console.log("RiggedFigure: This model is licensed under a Creative Commons Attribution 4.0 International License.");
		var duck = Laya.GLTFLoader.getRes("res/threeDimen/gltf/Duck/Duck.gltf");
		this.scene.addChild(duck);
		var cube = Laya.GLTFLoader.getRes("res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf");
		this.scene.addChild(cube);
		cube.transform.position = new Laya.Vector3(2.5, 0.6, 0);
		cube.transform.setWorldLossyScale(new Laya.Vector3(0.6, 0.6, 0.6));
	}
}

new LoadGltfRosource();