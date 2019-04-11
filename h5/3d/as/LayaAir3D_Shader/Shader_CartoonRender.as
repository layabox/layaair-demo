package LayaAir3D_Shader {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.RenderState;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Stat;
	import laya.webgl.resource.Texture2D;
	import laya.d3Extend.cartoonMaterial.CartoonMaterial;
	import laya.utils.Handler;
	import laya.d3.core.light.DirectionLight;
	
	/**
	 * ...
	 * @author
	 */
	public class Shader_CartoonRender {
		private var kiana:Sprite3D;
		
		public function Shader_CartoonRender() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			
			//自定义材质初始化shader
			CartoonMaterial.initShader();
			
			//加载场景
			Scene3D.load("res/threeDimen/cartoon/CartoonTest.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene);
				//获取场景相机
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				camera.addComponent(CameraMoveScript);
				//添加光照
				var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
				directionLight.color = new Vector3(1, 1, 1);
				directionLight.transform.rotate(new Vector3(-1.14 / 3, 0, 0));
				
				kiana = scene.getChildByName("Kiana") as Sprite3D;
				setkianaCartoon();
			}));
		}
		
		public function setkianaCartoon():void {
			var kiana_Cartoon:Sprite3D = kiana.getChildByName("Kiana_Cartoon") as Sprite3D;
			
			var kiana_cartoon_face:MeshSprite3D = kiana_Cartoon.getChildByName("Face") as MeshSprite3D;
			var kiana_cartoon_hair:MeshSprite3D = kiana_Cartoon.getChildByName("Hair") as MeshSprite3D;
			var kiana_cartoon_body:MeshSprite3D = kiana_Cartoon.getChildByName("Body") as MeshSprite3D;
			
			//创建材质
			var faceMaterial:CartoonMaterial = new CartoonMaterial();
			//加载纹理
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C1_Texture_Face_Color_Common.png", Handler.create(this, function(tex:Texture2D):void {
				faceMaterial.albedoTexture = tex;
			}));
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C1_Texture_Face_LightMap_Common.png", Handler.create(this, function(tex:Texture2D):void {
				faceMaterial.blendTexture = tex;
			}));
			//设置材质属性
			faceMaterial.shadowColor = new Vector4(0.8, 0.8, 0.8, 1.0);
			faceMaterial.shadowRange = 0.188;
			faceMaterial.shadowIntensity = 0.88;
			faceMaterial.specularRange = 0.9955;
			faceMaterial.specularIntensity = 0.99;
			
			//faceMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
			//设置描边线条的宽度
			faceMaterial.outlineWidth = 0.002;
			//设置描边线条的亮度
			faceMaterial.outlineLightness = 0.25;
			
			var hairMaterial:CartoonMaterial = new CartoonMaterial();
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Hair_Color_Common.png", Handler.create(this, function(tex:Texture2D):void {
				hairMaterial.albedoTexture = tex;
			}));
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Hair_LightMap_Common.png", Handler.create(this, function(tex:Texture2D):void {
				hairMaterial.blendTexture = tex;
			}));
			hairMaterial.shadowColor = new Vector4(0.8, 0.8, 0.8, 1.0);
			hairMaterial.shadowRange = 0.27;
			hairMaterial.shadowIntensity = 0.7956449;
			hairMaterial.specularRange = 0.9820514;
			hairMaterial.specularIntensity = 1.0;
			
			//hairMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
			hairMaterial.outlineWidth = 0.002;
			hairMaterial.outlineLightness = 0.25;
			
			var bodyMaterial:CartoonMaterial = new CartoonMaterial();
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Body_Color_RGB2048.png", Handler.create(this, function(tex:Texture2D):void {
				bodyMaterial.albedoTexture = tex;
			}));
			Texture2D.load("res/threeDimen/cartoon/Assets/CartoonTest/Texture/Avatar_Kiana_C2_Texture_Body_LightMap_Common.png", Handler.create(this, function(tex:Texture2D):void {
				bodyMaterial.blendTexture = tex;
			}));
			bodyMaterial.shadowColor = new Vector4(0.8, 0.8, 0.8, 1.0);
			bodyMaterial.shadowRange = 0.046;
			bodyMaterial.shadowIntensity = 0.816;
			bodyMaterial.specularRange = 0.985;
			bodyMaterial.specularIntensity = 0.938;
			
			//bodyMaterial.outlineTexture = Texture2D.load("CartoonRender2/Assets/CartoonTest/Texture/Avatar_Yae_sakura_C1_Texture_Body_LightMap_1ShadowColor.png");
			bodyMaterial.outlineWidth = 0.002;
			bodyMaterial.outlineLightness = 0.25;
			kiana_cartoon_face.meshRenderer.sharedMaterial = faceMaterial;
			kiana_cartoon_hair.meshRenderer.sharedMaterial = hairMaterial;
			kiana_cartoon_body.meshRenderer.sharedMaterial = bodyMaterial;
		}
	}
}