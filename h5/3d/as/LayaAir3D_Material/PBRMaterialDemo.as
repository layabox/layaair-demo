package {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.Mesh;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Scene;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class PBRMaterialDemo {
		private static var _tempPos:Vector3 = new Vector3();
		public function PBRMaterialDemo() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;

			Scene3D.load("res/LayaScene_EmptyScene/Conventional/EmptyScene.ls", Handler.create(this, function (scene: Scene3D): void {
				Laya.stage.addChild(scene);

				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				var moveScript: CameraMoveScript = camera.addComponent(CameraMoveScript);
				moveScript.speed = 0.005;

				var sphereMesh:Mesh = PrimitiveMesh.createSphere(0.25, 32, 32);
				var  row:Number = 6;
				addSpheresSpecialMetallic(sphereMesh, new Vector3(0, 1.5, 0), scene, row, new Vector4(186 / 255, 110 / 255, 64 / 255, 1.0), 1.0);
				addSpheresSmoothnessMetallic(sphereMesh, new Vector3(0, 0, 0), scene, 3, row, new Vector4(1.0, 1.0, 1.0, 1.0));
				addSpheresSpecialMetallic(sphereMesh, new Vector3(0, -1.5, 0), scene, row, new Vector4(0.0, 0.0, 0.0, 1.0), 0.0);
			}));
		}
		
		/**
		 * Add one with smoothness and metallic sphere.
		 */
		public function addPBRSphere(sphereMesh:Mesh, position:Vector3, scene:Scene3D, color:Vector4, smoothness:Number, metallic:Number): PBRStandardMaterial {
			var mat: PBRStandardMaterial = new PBRStandardMaterial();
			mat.albedoColor = color;
			mat.smoothness = smoothness;
			mat.metallic = metallic;

			var meshSprite:MeshSprite3D = new MeshSprite3D(sphereMesh);
			meshSprite.meshRenderer.sharedMaterial = mat;
			var transform: Transform3D = meshSprite.transform;
			transform.localPosition = position;
			scene.addChild(meshSprite);
			return mat;
		}


		/**
		 * Add some different smoothness and metallic sphere.
		 */
		public function addSpheresSmoothnessMetallic(sphereMesh:Mesh, offset:Vector3, scene:Scene3D, row:Number, col:Number, color:Vector4):void {
			const width:Number = col * 0.5;
			const height:Number = row * 0.5;
			for (var i:int = 0, n:int = col; i < n; i++) {//diffenent smoothness
				for (var j:int = 0, m:int = row; j < m; j++) {//diffenent metallic
					var smoothness:Number = i / (n - 1);
					var metallic:Number = 1.0 - j / (m - 1);

					var pos: Vector3 = PBRMaterialDemo._tempPos;
					pos.setValue(-width / 2 + i * width / (n - 1), height / 2 - j * height / (m - 1), 3.0);
					Vector3.add(offset, pos, pos);

					addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
				}
			}
		}

		/**
		 * Add some different smoothness with special metallic sphere.
		 */
		public function addSpheresSpecialMetallic(sphereMesh:Mesh, offset:Vector3, scene:Scene3D, col:Number, color:Vector4, metallic:Number = 0):void {
			const width:Number = col * 0.5;
			for (var i:int = 0, n:int = col; i < n; i++) {//diffenent smoothness
				var smoothness:Number = i / (n - 1);
				var metallic:Number = metallic;

				var pos: Vector3 = PBRMaterialDemo._tempPos;
				pos.setValue(-width / 2 + i * width / (n - 1), 0, 3.0);
				Vector3.add(offset, pos, pos);

				addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
			}
		}
	}
}