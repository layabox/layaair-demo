window.Laya=window.Laya||{};

(function (Laya) {
	'use strict';

	class Blinnphong_Transmission {
	    constructor() {
	        this.resource = [
	            "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png",
	            "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg"
	        ];
	        Laya.Laya3D.init(0, 0);
	        Laya.Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
	        Laya.Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	        Laya.Stat.show();
	        Laya.Shader3D.debugMode = true;
	        Laya.Scene3D.load("res/threeDimen/LayaScene_TransmissionScene/Conventional/TransmissionScene.ls", Laya.Handler.create(this, function (scene) {
	            Laya.Laya.stage.addChild(scene);
	            var camera = scene.getChildByName("Main Camera");
	            camera.addComponent(CameraMoveScript);
	            this.rabbitModel = scene.getChildByName("rabbit");
	            this.monkeyModel = scene.getChildByName("monkey");
	            this.rabbitMaterial = this.rabbitModel.meshRenderer.sharedMaterial;
	            this.monkeyMaterial = this.monkeyModel.meshRenderer.sharedMaterial;
	            this.loadThinkNessTexture();
	        }));
	    }
	    loadThinkNessTexture() {
	        Laya.Laya.loader.create(this.resource, Laya.Handler.create(this, this.onPreLoadFinish));
	    }
	    onPreLoadFinish() {
	        this.monkeyMaterial.thinknessTexture = Laya.Loader.getRes("res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png");
	        this.rabbitMaterial.thinknessTexture = Laya.Loader.getRes("res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg");
	        this.rabbitMaterial.enableTransmission = true;
	        this.rabbitMaterial.transmissionRata = 0.0;
	        this.rabbitMaterial.backDiffuse = 4.88;
	        this.rabbitMaterial.transmissionColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
	        this.rabbitMaterial.backScale = 1.0;
	        this.monkeyMaterial.enableTransmission = true;
	        this.monkeyMaterial.transmissionRata = 0.0;
	        this.monkeyMaterial.backDiffuse = 1.0;
	        this.monkeyMaterial.transmissionColor = new Laya.Vector4(0.2, 1.0, 0.0, 1.0);
	        this.monkeyMaterial.backScale = 1.0;
	    }
	}

	new Blinnphong_Transmission();

}(Laya));
