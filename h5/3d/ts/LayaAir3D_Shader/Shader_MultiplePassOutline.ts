import CameraMoveScript from "./common/CameraMoveScript"
import MultiplePassOutlineMaterial from "./customMaterials/MultiplePassOutlineMaterial"
class Shader_MultiplePassOutline {
	
	private rotation = new Laya.Vector3(0, 0.01, 0);
	
	constructor() {
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Shader3D.debugMode = true;
		//显示性能面板
		Laya.Stat.show();
		//初始化Shader
		debugger;
		MultiplePassOutlineMaterial.initShader();
		//创建场景
		var scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
		//创建相机
		var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
		camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		
		//创建平行光
		var directionLight = new Laya.DirectionLight();
		scene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(1, 1, 1);
		Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function(mesh:Laya.Mesh):void {
			var layaMonkey = scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
			layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
			layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
			var customMaterial = new MultiplePassOutlineMaterial();
			//漫反射贴图
			Laya.Texture2D.load("res/threeDimen/skinModel/LayaMonkey2/Assets/LayaMonkey/diffuse.png", Laya.Handler.create(this, function(texture:Laya.Texture2D):void {
				customMaterial.albedoTexture = texture;
			}));
			layaMonkey.meshRenderer.sharedMaterial = customMaterial;
			
			Laya.timer.frameLoop(1, this, function():void {
				layaMonkey.transform.rotate(this.rotation, false);
			});
		}));
	}

}

new Shader_MultiplePassOutline();