package LayaAir3D_Animation3D {
	import laya.d3.core.Sprite3D;
	import laya.d3.core.scene.Scene3D;
	import laya.display.Stage;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class AnimationEventByUnity {
		
		public function AnimationEventByUnity() {
			//初始化引擎
			Laya3D.init(0, 0);
			Stat.show();
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//加载场景
			Scene3D.load("res/threeDimen/scene/LayaScene_AnimationEvent/Conventional/layaScene.ls", Handler.create(this, function(scene:Scene3D):void {
				Laya.stage.addChild(scene) as Scene3D;
				var cube:Sprite3D = scene.getChildByName("Cube");
				debugger;
				//添加组件(脚本)
				cube.addComponent(SceneScript);
			}));
		}
	
	}
}

import laya.d3.component.Script3D;

class SceneScript extends Script3D {
	public function SceneScript() {
	
	}
	
	//对应unity添加的AnimationEvent的动画事件函数，名字是可以对应上的
	public function ShowMsg():void {
		trace("TTTTTTT");
	}
}
