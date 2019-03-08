package OfficialExample.LayaAir3D_Performance.LayaAir3D_Scene3D 
{
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.webgl.resource.Texture2D;
	import laya.d3.core.light.DirectionLight;
	/**
	 * ...
	 * @author ...
	 */
	public class EnvirReflection 
	{
		
		public function EnvirReflection() 
		{
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.rotate(new Vector3(10, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
			
			 //添加方向光
            var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
            //设置灯光漫反射颜色
            directionLight.color = new Vector3(0.6, 0.6, 0.6);
            //设置灯光的方向（弧度）
            directionLight.transform.worldMatrix.setForward(new Vector3(1, -1, 0));
			
			var sprite3D:Sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			//球体
			var sphere:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(0.25, 20, 20))) as MeshSprite3D;
			sphere.transform.position = new Vector3(0.0, 0.4, -5);
			sphere.transform.scale = new Vector3(5, 5, 5);
			//实例PBR材质
			var mat:PBRStandardMaterial = new PBRStandardMaterial();
			mat.enableReflection = true;
			//mat.metallic =;
			mat._Glossiness = 2;
			//反射贴图
			Texture2D.load('../../../../res/threeDimen/layabox.png', Handler.create(null, function(texture:Texture2D):void {
					mat.albedoTexture = texture;
					sphere.meshRenderer.material = mat;
				}));
			//天空盒
			BaseMaterial.load("../../../../res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Handler.create(null, function(mat:SkyBoxMaterial):void {
				var skyRenderer:SkyRenderer =camera.skyRenderer;
				skyRenderer.mesh = SkyBox.instance;
				skyRenderer.material = mat;
				var exposureNumber:Number = 0;
				mat.exposure = 1.5;
				/*Laya.timer.frameLoop(1, this, function():void {
					mat.exposure = Math.sin(exposureNumber += 0.01) + 1;
					mat.rotation += 0.01;
				});*/
			}));
		}
		
	}

}