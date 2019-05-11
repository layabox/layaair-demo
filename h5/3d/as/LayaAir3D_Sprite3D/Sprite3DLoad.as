package LayaAir3D_Sprite3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Matrix4x4;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.net.WorkerLoader;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.utils.Timer;
	
	public class Sprite3DLoad {
		public function Sprite3DLoad() {
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			scene.ambientColor = new Vector3(1, 1, 1);
			
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 0.5, 1));
			camera.transform.rotate(new Vector3(-15, 0, 2), true, false);
			camera.addComponent(CameraMoveScript);
			
			Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(sprite:Sprite3D):void {
				scene.addChild(sprite);
				var cameraTransform:Transform3D = camera.transform;
				var cameraPosition:Vector3 = new Vector3();
				var cameraRight:Vector3 = new Vector3();
				var cameraUp:Vector3 = new Vector3();
				var cameraForward:Vector3 = new Vector3();
				var transformMat:Matrix4x4 = new Matrix4x4();
				//设置时钟定时执行
				Laya.timer.frameLoop(1, this, function():void {
				var objectPosition:Vector3 = sprite.transform.position;
				var cameraPosition:Vector3 = cameraTransform.position;
				cameraTransform.getRight(cameraRight);
				cameraTransform.getUp(cameraUp);
				cameraTransform.getForward(cameraForward);
				Matrix4x4.billboard(objectPosition, cameraPosition, cameraRight, cameraUp, cameraForward, transformMat);
				//sprite.transform.worldMatrix = transformMat;
			});
		}));
		}
	}
}