package LayaAir3D_Material {
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.material.EffectMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.display.Stage;
	import laya.resource.Texture2D;
	import laya.utils.Handler;
	import laya.utils.Stat;

	
	/**
	 * ...
	 * @author ...
	 */
	public class EffectMaterialDemo {
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function EffectMaterialDemo() {
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
			
			var earth:MeshSprite3D = scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere())) as MeshSprite3D;
			earth.transform.position = new Vector3(0, 0, 0);
			//创建EffectMaterial材质
			var material:EffectMaterial = new EffectMaterial();
			Texture2D.load("res/threeDimen/texture/earth.png", Handler.create(this, function(texture:Texture2D):void {
				//设置纹理
				material.texture = texture;
				//设置材质颜色
				material.color = new Vector4(0.6, 0.6, 0.6, 1);
			}));
			earth.meshRenderer.material = material;
			
			Laya.timer.frameLoop(1, this, function():void {
				earth.transform.rotate(rotation, false);
			});
		}
	
	}

}