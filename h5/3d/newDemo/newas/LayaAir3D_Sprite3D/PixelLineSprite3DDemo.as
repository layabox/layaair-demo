package LayaAir3D_Sprite3D 
{
	import common.CameraMoveScript;
	import common.Tool;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.pixelLine.PixelLineSprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.d3.resource.models.PrimitiveMesh;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.utils.Stat;
	public class PixelLineSprite3DDemo 
	{
		private var sprite3D:Sprite3D;
		private var lineSprite3D:Sprite3D;
		
		public function PixelLineSprite3DDemo() 
		{
			Shader3D.debugMode = true;
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 2, 5));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(new Vector3(-1.0, -1.0, -1.0));
			directionLight.transform.worldMatrix=mat;
			
			sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			lineSprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//球体
			var sphere:MeshSprite3D = sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(0.25, 20, 20))) as MeshSprite3D;
			sphere.transform.position = new Vector3(0.0, 0.75, 2);
			var sphereLineSprite3D:PixelLineSprite3D = lineSprite3D.addChild(new PixelLineSprite3D(3500)) as PixelLineSprite3D;
			Tool.linearModel(sphere, sphereLineSprite3D, Color.GREEN);
			sprite3D.active = false;;
			lineSprite3D.active = true;
		}

		
	}

}