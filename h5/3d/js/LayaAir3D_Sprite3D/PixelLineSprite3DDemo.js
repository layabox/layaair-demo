import CameraMoveScript from "./common/CameraMoveScript"
import Tool from "./common/Tool"
class PixelLineSprite3DDemo 
{
	constructor() 
	{
		Laya.Shader3D.debugMode = true;
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.Stat.show();
		
		var scene = Laya.stage.addChild(new Laya.Scene3D());
		
		var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
		camera.transform.translate(new Laya.Vector3(0, 2, 5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
		
		var directionLight = scene.addChild(new Laya.DirectionLight());
		//设置平行光的方向
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix=mat;
		
		this.sprite3D = scene.addChild(new Laya.Sprite3D());
		this.lineSprite3D = scene.addChild(new Laya.Sprite3D());
		

		
		//球体
		var sphere = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20)));
		sphere.transform.position = new Laya.Vector3(0.0, 0.75, 2);
		var sphereLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3500));
		Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);
		this.sprite3D.active = false;;
		this.lineSprite3D.active = true;
	}

	
}

new PixelLineSprite3DDemo;
