package LayaAir3D_Scene3D {
	import common.CameraMoveScript;
	import laya.d3.core.Camera;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Vector4;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class SceneLoad1 {
		public function SceneLoad1() {
			//初始化引擎
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//加载场景
			Scene3D.load("res/threeDimen/scene/LayaScene_dudeScene/Conventional/dudeScene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				
				//获取场景中的相机
				var camera:Camera = scene.getChildByName("Camera") as Camera;
				//移动摄像机位置
				camera.transform.position = new Vector3(0, 0.81, -1.85);
				//旋转摄像机角度
				camera.transform.rotate(new Vector3(0, 0, 0), true, false);
				//设置摄像机视野范围（角度）
				camera.fieldOfView = 60;
				//设置背景颜色
				camera.clearColor = new Vector4(0, 0, 0.6, 1);
				//加入摄像机移动控制脚本
				camera.addComponent(CameraMoveScript);
				
				//设置灯光环境色
				//scene.ambientColor = new Vector3(2.5, 0, 0);
			}));
		}
	}
}