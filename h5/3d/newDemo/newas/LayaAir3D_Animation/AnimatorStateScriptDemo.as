package LayaAir3D_Animation {
	import common.CameraMoveScript;
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Vector3;
	import laya.d3.math.Matrix4x4;
	import laya.display.Stage;
	import laya.display.Text;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class AnimatorStateScriptDemo {
		
		private var scene:Scene3D;
		private var animator:Animator;
		private var changeActionButton:Button;
		private var changeActionButton2:Button;
		private var PlayStopIndex:int = 0;
		private var curStateIndex:int = 0;
		private var text:Text = new Text();
		private var textName:Text = new Text();
		private var curActionName:String = null;
		
		private var _translate:Vector3 = new Vector3(0, 3, 5);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _forward:Vector3 = new Vector3( -1.0, -1.0, -1.0);
		
		public function AnimatorStateScriptDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//开启统计信息
			Stat.show();
			
			//预加载所有资源
			var resource:Array = ["res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh",  "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh",  "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void {
			//初始化场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			scene.ambientColor.setValue(0.5, 0.5, 0.5);
			
			//初始化相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;
			
			//初始化角色精灵
			var role:Sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			//初始化胖子
			var pangzi:Sprite3D = role.addChild(Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh")) as Sprite3D;
			//获取动画组件
			animator = pangzi.getChildAt(0).getComponent(Animator) as Animator;
			//创建动作状态
			var state1:AnimatorState = new AnimatorState();
			//动作名称
			state1.name = "hello";
			//动作播放起始时间
			state1.clipStart = 296 / 581;
			//动作播放结束时间
			state1.clipEnd = 346 / 581;
			//设置动作
			state1.clip = animator.getDefaultState().clip;
			//循环模式
			state1.clip.islooping = true;
			//为动画状态添加动画状态脚本
			var asst1:AnimatorStateScriptTest = state1.addScript(AnimatorStateScriptTest);
			asst1.text = text;
			animator.speed = 0.0;
			//为动画组件添加一个动作状态
			animator.addState(state1);
			
			var state2:AnimatorState = new AnimatorState();
			state2.name = "ride";
			state2.clipStart = 0 / 581;
			state2.clipEnd = 33 / 581;
			state2.clip = animator.getDefaultState().clip;
			state2.clip.islooping = true;
			var asst2:AnimatorStateScriptTest = state2.addScript(AnimatorStateScriptTest);
			asst2.text = text;
			animator.addState(state2);
			
			
			var state3:AnimatorState = new AnimatorState();
			state3.name = "动作状态三";
			state3.clipStart = 34 / 581;
			state3.clipEnd = 100 / 581;
			state3.clip = animator.getDefaultState().clip;
			state3.clip.islooping = true;
			animator.speed = 0.0;
			var asst3:AnimatorStateScriptTest = state3.addScript(AnimatorStateScriptTest);
			asst3.text = text;
			animator.addState(state3);
			
			
			loadUI();
			textName.x = Laya.stage.width / 2 - 50;
			text.x = Laya.stage.width / 2 - 50;
			text.y = 50;
			textName.overflow = Text.HIDDEN;
			textName.color = "#FFFFFF";
			textName.font = "Impact";
			textName.fontSize = 20;
			textName.borderColor = "#FFFF00";
			textName.x = Laya.stage.width / 2;
			textName.text = "当前动作状态名称：";
			Laya.stage.addChild(textName);
			
			text.name = "text";
			text.overflow = Text.HIDDEN;
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			text.text = "动画状态：";
			Laya.stage.addChild(text);
		
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换动作状态")) as Button;
				changeActionButton.size(200, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 , Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void {
					
					curStateIndex++;
					if (curStateIndex % 3 == 0) {
						animator.speed = 0.0;
						animator.play("hello");
						curActionName = "hello";
						textName.text = "当前动作状态名称:" + "hello";
						animator.speed = 1.0;
					} else if (curStateIndex % 3 == 1) {
						animator.speed = 0.0;
						animator.play("ride");
						curActionName = "ride";
						textName.text = "当前动作状态名称:" + "ride";
						animator.speed = 1.0;
					} else if (curStateIndex % 3 == 2) {
						animator.speed = 0.0;
						animator.play("动作状态三");
						curActionName = "动作状态三";
						textName.text = "当前动作状态名称:" + "动作状态三";
						animator.speed = 1.0;
					} 
	
				});
			
			}));
		}
	}

}

import laya.d3.animation.AnimatorStateScript;
import laya.display.Text;
//继承自AnimatorStateScript(动画状态脚本)
class AnimatorStateScriptTest extends AnimatorStateScript {
	private var _text:Text = null;
	
	public function get text():Text {
		return _text;
	}
	public function set text(value:Text):int {
		_text = value;
	}
	public function AnimatorStateScriptTest() {
	}
	
	
	/**
	 * 动画状态开始时执行。
	 */
	override public function onStateEnter():void {
		trace("动画开始播放了");
		_text.text = "动画状态：动画开始播放";
	}
	
	/**
	 * 动画状态更新时执行。
	 */
	override public function onStateUpdate():void {
		trace("动画状态更新了");
		_text.text = "动画状态：动画更新中";
	}
	
	/**
	 * 动画状态退出时执行。
	 */
	override public function onStateExit():void {
		trace("动画退出了");
		_text.text = "动画状态：动画开始退出";
	}
}