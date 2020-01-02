class PBRMaterialDemo{
    constructor(){
        Laya.Shader3D.debugMode = true;
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

		Laya.Scene3D.load("res/threeDimen/scene/LayaScene_EmptyScene/Conventional/EmptyScene.ls", Laya.Handler.create(this, function (scene) {
			Laya.stage.addChild(scene);

			var camera = scene.getChildByName("Main Camera");
			var moveScript = camera.addComponent(CameraMoveScript);
			moveScript.speed = 0.005;

			var sphereMesh = Laya.PrimitiveMesh.createSphere(0.25, 32, 32);
			const row = 6;
			this.addSpheresSpecialMetallic(sphereMesh, new Laya.Vector3(0, 1.5, 0), scene, row, new Laya.Vector4(186 / 255, 110 / 255, 64 / 255, 1.0), 1.0);
			this.addSpheresSmoothnessMetallic(sphereMesh, new Laya.Vector3(0, 0, 0), scene, 3, row, new Laya.Vector4(1.0, 1.0, 1.0, 1.0));
            this.addSpheresSpecialMetallic(sphereMesh, new Laya.Vector3(0, -1.5, 0), scene, row, new Laya.Vector4(0.0, 0.0, 0.0, 1.0), 0.0);
            
		}));
		
    }

    /**
	 * Add one with smoothness and metallic sphere.
	 */
	addPBRSphere(sphereMesh, position, scene, color, smoothness, metallic) {
		var mat = new Laya.PBRStandardMaterial();
		mat.albedoColor = color;
		mat.smoothness = smoothness;
		mat.metallic = metallic;

		var meshSprite = new Laya.MeshSprite3D(sphereMesh);
		meshSprite.meshRenderer.sharedMaterial = mat;
		var transform = meshSprite.transform;
		transform.localPosition = position;
		scene.addChild(meshSprite);
		return mat;
    }
    
    /**
	 * Add some different smoothness and metallic sphere.
	 */
	addSpheresSmoothnessMetallic(sphereMesh, offset, scene, row, col, color) {
		const width = col * 0.5;
		const height = row * 0.5;
		for (var i = 0, n = col; i < n; i++) {//diffenent smoothness
			for (var j = 0, m = row; j < m; j++) {//diffenent metallic
				var smoothness = i / (n - 1);
				var metallic = 1.0 - j / (m - 1);

				var pos = PBRMaterialDemo._tempPos;
				pos.setValue(-width / 2 + i * width / (n - 1), height / 2 - j * height / (m - 1), 3.0);
				Laya.Vector3.add(offset, pos, pos);

				this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
			}
		}
	}

	/**
	 * Add some different smoothness with special metallic sphere.
	 */
	addSpheresSpecialMetallic(sphereMesh, offset, scene, col, color, metallic) {
		const width = col * 0.5;
		for (var i = 0, n = col; i < n; i++) {//diffenent smoothness
			var smoothness = i / (n - 1);
			var metallic = metallic;

			var pos = PBRMaterialDemo._tempPos;
			pos.setValue(-width / 2 + i * width / (n - 1), 0, 3.0);
			Laya.Vector3.add(offset, pos, pos);

			this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
		}
	}

}

PBRMaterialDemo._tempPos = new Laya.Vector3();


//激活启动类
new PBRMaterialDemo();
