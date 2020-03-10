package LayaAir3D_Lighting {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.SkinnedMeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.math.Matrix4x4;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.core.light.shadowCascadesMode;
	import laya.d3.core.light.shadowMode;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.ui.Button;
	import laya.events.Event;
	import laya.utils.Browser;


    
    /**
     * ...
     * @author ...
     */
	public class RealTimeShadow {
        
        private var _quaternion:Quaternion = new Quaternion();
		private var _direction:Vector3 = new Vector3();
        private var scene:Scene3D;
        
        public function RealTimeShadow() {
			//Init engine.
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//show stat.
			Stat.show();

			Laya.loader.create([
				"res/threeDimen/staticModel/grid/plane.lh",
				"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
			], Handler.create(this, this.onComplete));
        }

		private function onComplete(): void {
			var scene: Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;

			var camera: Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera ;
			camera.transform.translate(new Vector3(0, 1.2, 1.6));
			camera.transform.rotate(new Vector3(-35, 0, 0), true, false);
			//camera.addComponent(CameraMoveScript);

			var directionLight: DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(0.85, 0.85, 0.8);
			directionLight.transform.rotate(new Vector3(-Math.PI / 3, 0, 0));

			// Use soft shadow.
			directionLight.shadowMode = Laya.ShadowMode.SoftLow;
			// Set shadow max distance from camera.
			directionLight.shadowDistance = 3;
			// Set shadow resolution.
			directionLight.shadowResolution = 1024;
			// Set shadow cascade mode.
			directionLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;

			// Add rotation script to light.
			var rotationScript: RotationScript = directionLight.addComponent(RotationScript);

			// A plane receive shadow.
			var grid: Sprite3D = scene.addChild(Loader.getRes("res/threeDimen/staticModel/grid/plane.lh"));
			grid.getChildAt(0).meshRenderer.receiveShadow = true;

			// A monkey cast shadow.
			var layaMonkey: Sprite3D = scene.addChild(Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
			layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
			layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.castShadow = true;

			// A sphere cast/receive shadow.
			var sphereSprite: MeshSprite3D = this.addPBRSphere(PrimitiveMesh.createSphere(0.1), new Vector3(0, 0.2, 0.5), scene);
			sphereSprite.meshRenderer.castShadow = true;
			sphereSprite.meshRenderer.receiveShadow = true;

			// Add Light controll UI.
			this.loadUI(rotationScript);
		}
		/**
		 * Add one with smoothness and metallic sphere.
		 */
		private function addPBRSphere(sphereMesh: Mesh, position: Vector3, scene: Scene3D): MeshSprite3D {
			var mat: PBRStandardMaterial = new PBRStandardMaterial();
			mat.smoothness = 0.2;

			var meshSprite: MeshSprite3D = new MeshSprite3D(sphereMesh);
			meshSprite.meshRenderer.sharedMaterial = mat;
			var transform: Transform3D = meshSprite.transform;
			transform.localPosition = position;
			scene.addChild(meshSprite);
			return meshSprite;
		}

		/**
		 * Add Button control light rotation.
		 */
		private function  loadUI(rottaionScript: RotationScript): void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
				var rotationButton: Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "Stop Rotation")) as Button ;
				rotationButton.size(150, 30);
				rotationButton.labelSize = 20;
				rotationButton.sizeGrid = "4,4,4,4";
				rotationButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				rotationButton.pos(Laya.stage.width / 2 - rotationButton.width * Browser.pixelRatio / 2, Laya.stage.height - 40 * Browser.pixelRatio);
				rotationButton.on(Event.CLICK, this, function (): void {
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
}

import laya.d3.component.Script3D;
import laya.d3.core.MeshSprite3D;
import laya.d3.core.material.PBRSpecularMaterial;
import laya.d3.math.Vector3;
import laya.d3.math.Vector4;
/**
 * Light rotation script.
 */
class RotationScript extends Script3D {
	/** Roation speed. */
	private var autoRotateSpeed: Vector3 = new Vector3(0, 0.05, 0);
	/** If roation. */
	private var rotation:Boolean= true;

	override public function onUpdate(): void {
		if (rotation)
			this.owner.transform.rotate(autoRotateSpeed, false);
	}
}





