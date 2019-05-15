package LayaAir3D_Advance {
	import common.CameraMoveScript;
	import laya.d3.component.PostProcess;
	import laya.d3.core.Camera;
	import laya.d3.core.render.BloomEffect;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Color;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class PostProcessBloom {
		
		private var rotation:Vector3 = new Vector3(0, 0.01, 0);
		
		public function PostProcessBloom() {
			//初始化引擎
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//加载场景
			Scene3D.load("res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				
				//获取场景中的相机
				var camera:Camera = scene.getChildByName("Main Camera") as Camera;
				//加入摄像机移动控制脚本
				camera.addComponent(CameraMoveScript);
				
				var postProcess:PostProcess = new PostProcess();
				var bloom:BloomEffect = new BloomEffect();
				postProcess.addEffect(bloom);
				camera.postProcess = postProcess;
				
				bloom.intensity = 5;
				bloom.threshold = 0.90;
				bloom.softKnee = 0.5;
				bloom.clamp = 65472;
				bloom.diffusion = 7;
				bloom.anamorphicRatio = 0.0;
				bloom.color = new Color(1, 1, 1, 1);
				bloom.fastMode = true;
			}));
		}
	}
}