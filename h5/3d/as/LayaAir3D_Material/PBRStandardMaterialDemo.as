package LayaAir3D_Material {
	import common.CameraMoveScript;
	import laya.d3.core.BaseCamera;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.material.BaseMaterial;
	import laya.d3.core.material.PBRStandardMaterial;
	import laya.d3.core.material.SkyBoxMaterial;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.SkyBox;
	import laya.d3.resource.models.SkyRenderer;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.resource.Texture2D;
	
	/**
	 * ...
	 * @author ...
	 */
	public class PBRStandardMaterialDemo {
		
		public function PBRStandardMaterialDemo() {
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Scene3D.load("res/threeDimen/scene/PBRMaterialScene/Showcase.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				camera.clearFlag = BaseCamera.CLEARFLAG_SKY;
				BaseMaterial.load("res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Handler.create(this, function(mat:SkyBoxMaterial):void {
					var skyRenderer:SkyRenderer = camera.skyRenderer;
					skyRenderer.mesh = SkyBox.instance;
					skyRenderer.material = mat;
				}));
				
				//实例PBR材质
				var mat:PBRStandardMaterial = new PBRStandardMaterial();
				//albedoTexture:法线贴图：增强模型细节
				
				//反射贴图
				Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_AlbedoTransparency.png', Handler.create(this, function(texture:Texture2D):void {
					mat.albedoTexture = texture;
				}));
				
				//法线贴图
				Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Normal.png', Handler.create(this, function(texture:Texture2D):void {
					mat.normalTexture = texture;
				}));
				
				//金属光滑度贴图
				Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_MetallicSmoothness.png', Handler.create(this, function(texture:Texture2D):void {
					mat.metallicGlossTexture = texture;
				}));
				
				//遮挡贴图
				Texture2D.load('res/threeDimen/scene/PBRMaterialScene/Assets/PBR Barrel/Materials/Textures/Barrel_Occlusion.png', Handler.create(this, function(texture:Texture2D):void {
					mat.occlusionTexture = texture;
				}));
				
				//反射颜色
				mat.albedoColor = new Vector4(1, 1, 1, 1);
				//光滑度缩放系数
				mat.smoothnessTextureScale = 1.0;
				//遮挡贴图强度
				mat.occlusionTextureStrength = 1.0;
				//法线贴图缩放系数
				mat.normalScale = 1;
				//光滑度数据源:从金属度贴图/反射贴图获取。
				mat.smoothnessSource = PBRStandardMaterial.SmoothnessSource_MetallicGlossTexture_Alpha;
				
				var barrel:MeshSprite3D = scene.getChildByName("Wooden_Barrel") as MeshSprite3D;
				var barrel1:MeshSprite3D = scene.getChildByName("Wooden_Barrel (1)") as MeshSprite3D;
				var barrel2:MeshSprite3D = scene.getChildByName("Wooden_Barrel (2)") as MeshSprite3D;
				var barrel3:MeshSprite3D = scene.getChildByName("Wooden_Barrel (3)") as MeshSprite3D;
				
				barrel.meshRenderer.sharedMaterial = mat;
				barrel1.meshRenderer.sharedMaterial = mat;
				barrel2.meshRenderer.sharedMaterial = mat;
				barrel3.meshRenderer.sharedMaterial = mat;
			}));
		
		}
	
	}

}
