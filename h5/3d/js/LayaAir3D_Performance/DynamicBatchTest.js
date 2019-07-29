//2019.0.17 8.00PM

//PC:
//机型:Surface Pro 6     CPU:I5-8250U 	  GPU:Intel UHD Graphics 620    平台:chrome:75.0.3770.90     分辨率:外接1080P显示器 Chrome全屏    帧率：43-45

//Mobile
//机型:Mi note 3   		 CPU:骁龙660      GPU:CPU集成                    平台：chrome 71.0.3578.99    分辨率:横屏                         帧率： 16-17
//机型:Mi Mix3       	 CPU:骁龙845 	  GPU:CPU集成                    平台:chrome:72.0.3626.105    分辨率:横屏                         帧率：16-19 
//机型:Mi 9        		 CPU:骁龙855 	  GPU:CPU集成                    平台:chrome:75.0.3770.89     分辨率:横屏                         帧率：52-55          

class DynamicBatchTest {
	constructor() {
		Laya.Shader3D.debugMode = true;
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();

		var scene = Laya.stage.addChild(new Laya.Scene3D());
		scene.ambientColor = new Laya.Vector3(1, 1, 1);

		var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
		camera.transform.translate(new Laya.Vector3(0, 6.2, 10.5));
		camera.transform.rotate(new Laya.Vector3(-40, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);

		Laya.Texture2D.load("res/threeDimen/layabox.png", Laya.Handler.create(this, function (tex) {
			var radius = new Laya.Vector3(0, 0, 1);
			var radMatrix = new Laya.Matrix4x4();
			var circleCount = 50;

			var boxMesh = Laya.PrimitiveMesh.createBox(0.02, 0.02, 0.02);
			var boxMat = new Laya.BlinnPhongMaterial();
			boxMat.albedoTexture = tex;
			for (var i = 0; i < circleCount; i++) {
				radius.z = 1.0 + i * 0.15;
				radius.y = i * 0.03;
				var oneCircleCount = 100 + i * 15;
				for (var j = 0; j < oneCircleCount; j++) {
					var boxSprite = new Laya.MeshSprite3D(boxMesh);
					boxSprite.meshRenderer.sharedMaterial = boxMat;
					var localPos = boxSprite.transform.localPosition;
					var rad = ((Math.PI * 2) / oneCircleCount) * j;
					Laya.Matrix4x4.createRotationY(rad, radMatrix);
					Laya.Vector3.transformCoordinate(radius, radMatrix, localPos);
					boxSprite.transform.localPosition = localPos;
					scene.addChild(boxSprite);
				}
			}
		}));
	}

}

new DynamicBatchTest();

