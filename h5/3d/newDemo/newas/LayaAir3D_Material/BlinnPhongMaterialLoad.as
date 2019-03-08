package OfficialExample.LayaAir3D_Material {
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author
	 */
	public class BlinnPhongMaterialLoad {
		
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function BlinnPhongMaterialLoad() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.9, 1.5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color = new Vector3(0.6, 0.6, 0.6);
			
			Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(null, function(mesh:Mesh):void {
				var layaMonkey:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
				layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
				//加载材质
				BaseMaterial.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat", Handler.create(null, function(mat:BaseMaterial):void {
					layaMonkey.meshRenderer.material = mat;
				}));
				
				Laya.timer.frameLoop(1, this, function():void {
					layaMonkey.transform.rotate(rotation, false);
				});
			}));
		}
	}
}