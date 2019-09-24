package LayaAir3D_Shader {
	import LayaAir3D_Shader.customMaterials.MultiplePassOutlineMaterial;
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.resource.Texture2D;
	
	public class Shader_MultiplePassOutline {
		
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function Shader_MultiplePassOutline() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			//初始化Shader
			MultiplePassOutlineMaterial.initShader();
			//创建场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			//创建相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 0.85, 1.7));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//创建平行光
			var directionLight:DirectionLight = new DirectionLight();
			scene.addChild(directionLight);
			directionLight.color = new Vector3(1, 1, 1);
			Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Handler.create(this, function(mesh:Mesh):void {
				var layaMonkey:MeshSprite3D = scene.addChild(new MeshSprite3D(mesh)) as MeshSprite3D;
				layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
				layaMonkey.transform.rotation = new Quaternion(0.7071068, 0, 0, -0.7071067);
				var customMaterial:MultiplePassOutlineMaterial = new MultiplePassOutlineMaterial();
				//漫反射贴图
				Texture2D.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/diffuse.png", Handler.create(this, function(texture:Texture2D):void {
					customMaterial.albedoTexture = texture;
				}));
				layaMonkey.meshRenderer.sharedMaterial = customMaterial;
				
				Laya.timer.frameLoop(1, this, function():void {
					layaMonkey.transform.rotate(rotation, false);
				});
			}));
		}	
	}

}