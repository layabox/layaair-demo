package LayaAir3D_Performance {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Matrix4x4;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.resource.Texture2D;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.core.MeshSprite3D;
	/**
	 * ...
	 * @author ...
	 */
	public class DynamicBatchTest {
		
		public function DynamicBatchTest() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();

			var scene:Scene3D = new Scene3D();
			Laya.stage.addChild(scene);
			scene.ambientColor = new Vector3(1, 1, 1);
			var camera:Camera = new Camera(0, 0.1, 1000);
			scene.addChild(camera);
			camera.transform.translate(new Vector3(0, 6.2, 10.5));
			camera.transform.rotate(new Vector3(-40, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			Texture2D.load("res/threeDimen/layabox.png", Handler.create(null, function (tex: Texture2D): void {
				var radius: Vector3 = new Vector3(0, 0, 1);
				var radMatrix: Matrix4x4 = new Matrix4x4();
				var circleCount:Number = 50;

				var boxMesh: Mesh = PrimitiveMesh.createBox(0.02, 0.02, 0.02);
				var boxMat: BlinnPhongMaterial = new BlinnPhongMaterial();
				boxMat.albedoTexture = tex;
				for (var i: Number = 0; i < circleCount; i++) {
					radius.z = 1.0 + i * 0.15;
					radius.y = i * 0.03;
					var oneCircleCount: Number = 100 + i * 15;
					for (var j: int = 0; j < oneCircleCount; j++) {
						var boxSprite: MeshSprite3D = new MeshSprite3D(boxMesh);
						boxSprite.meshRenderer.sharedMaterial = boxMat;
						var localPos: Vector3 = boxSprite.transform.localPosition;
						var rad: Number = ((Math.PI * 2) / oneCircleCount) * j;
						Matrix4x4.createRotationY(rad, radMatrix);
						Vector3.transformCoordinate(radius, radMatrix, localPos);
						boxSprite.transform.localPosition = localPos;
						scene.addChild(boxSprite);
					}
				}
			}));
			
		}
		
	}

}