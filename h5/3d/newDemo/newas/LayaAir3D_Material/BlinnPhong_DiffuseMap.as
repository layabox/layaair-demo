package LayaAir3D_Material {
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.BlinnPhongMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	
	public class BlinnPhong_DiffuseMap {
			
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function BlinnPhong_DiffuseMap() {
			
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 100))) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1.5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.color.setValue(1, 1, 1);
			
			var earth1:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere())) as MeshSprite3D;
			earth1.transform.position = new Vector3(-0.6, 0, 0);
			
			var earth2:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere())) as MeshSprite3D;
			earth2.transform.position = new Vector3(0.6, 0, 0);
			var material:BlinnPhongMaterial = new BlinnPhongMaterial();
			//漫反射贴图
			Texture2D.load("res/threeDimen/texture/earth.png", Handler.create(null, function(texture:Texture2D):void {
				material.albedoTexture = texture;
			}));
			earth2.meshRenderer.material = material;
			
			Laya.timer.frameLoop(1, null, function():void {
				earth1.transform.rotate(rotation, false);
				earth2.transform.rotate(rotation, false);
			});
		}
	}
}