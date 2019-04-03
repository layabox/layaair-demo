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
	public class AnimatorDemo {
		
		private var _scene:Scene3D;
		private var _animator:Animator;
		private var _changeActionButton:Button;
		private var _changeActionButton2:Button;
		private var _PlayStopIndex:int = 0;
		private var _curStateIndex:int = 0;
		private var _text:Text = new Text();
		private var _textName:Text = new Text();
		private var _curActionName:String = null;
		
		private var _translate:Vector3 = new Vector3(0, 3, 5);
		private var _rotation:Vector3 = new Vector3( -15, 0, 0);
		private var _forward:Vector3 = new Vector3( -1.0, -1.0, -1.0);
		
		public function AnimatorDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//开启统计信息
			Stat.show();
			
			//预加载所有资源
			var resource:Array = ["res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh","res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh",  "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void {
			//初始化场景
			_scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			_scene.ambientColor.setValue(0.5, 0.5, 0.5);
			
			//初始化相机
			var camera:Camera = _scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation, true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = _scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat:Matrix4x4 = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;

			
			//初始化角色精灵
			var role:Sprite3D = _scene.addChild(new Sprite3D()) as Sprite3D;
			debugger;
			//初始化胖子
			var pangzi:Sprite3D = role.addChild(Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh")) as Sprite3D;
			//获取动画组件
			_animator = pangzi.getChildAt(0).getComponent(Animator) as Animator;
			//创建动作状态
			var state1:AnimatorState = new AnimatorState();
			//动作名称
			state1.name = "hello";
			//动作播放起始时间
			state1.clipStart = 296 / 581;
			//动作播放结束时间
			state1.clipEnd = 346 / 581;
			//设置动作
			state1.clip = _animator.getDefaultState().clip;
			//循环模式
			state1.clip.islooping = true;
			//为动画状态添加动画状态脚本
			state1.addScript(AnimatorStateScriptDemo);
			//为动画组件添加一个动作状态
			_animator.addState(state1);
			
			var state2:AnimatorState = new AnimatorState();
			state2.name = "ride";
			state2.clipStart = 0 / 581;
			state2.clipEnd = 33 / 581;
			state2.clip = _animator.getDefaultState().clip;
			state2.clip.islooping = true;
			state2.addScript(AnimatorStateScriptDemo);
			_animator.addState(state2);
			_animator.speed = 0.0;
			
			var state3:AnimatorState = new AnimatorState();
			state3.name = "动作状态三";
			state3.clipStart = 34 / 581;
			state3.clipEnd = 100 / 581;
			state3.clip = _animator.getDefaultState().clip;
			state3.clip.islooping = true;
			state3.addScript(AnimatorStateScriptDemo);
			_animator.addState(state3);
			_animator.speed = 0.0;
			
			var state4:AnimatorState = new AnimatorState();
			state4.name = "动作状态四";
			state4.clipStart = 101 / 581;
			state4.clipEnd = 200 / 581;
			state4.clip = _animator.getDefaultState().clip;
			state4.clip.islooping = true;
			state4.addScript(AnimatorStateScriptDemo);
			_animator.addState(state4);
			_animator.speed = 0.0;
			
			var state5:AnimatorState = new AnimatorState();
			state5.name = "动作状态五";
			state5.clipStart = 201 / 581;
			state5.clipEnd = 295 / 581;
			state5.clip = _animator.getDefaultState().clip;
			state5.clip.islooping = true;
			state5.addScript(AnimatorStateScriptDemo);
			_animator.addState(state5);
			_animator.speed = 0.0;
			
			var state6:AnimatorState = new AnimatorState();
			state6.name = "动作状态六";
			state6.clipStart = 345 / 581;
			state6.clipEnd = 581 / 581;
			state6.clip = _animator.getDefaultState().clip;
			state6.clip.islooping = true;
			state6.addScript(AnimatorStateScriptDemo);
			_animator.addState(state6);
			_animator.speed = 0.0;
			
			loadUI();
			_textName.x = Laya.stage.width / 2 - 50;
			_textName.overflow = Text.HIDDEN;
			_textName.color = "#FFFFFF";
			_textName.font = "Impact";
			_textName.fontSize = 20;
			_textName.borderColor = "#FFFF00";
			_textName.x = Laya.stage.width / 2;
			_textName.text = "当前动作状态名称：";
			Laya.stage.addChild(_textName);
			
			_text.x = Laya.stage.width / 2 - 50;
			_text.y = 50;
			_text.overflow = Text.HIDDEN;
			_text.color = "#FFFFFF";
			_text.font = "Impact";
			_text.fontSize = 20;
			_text.borderColor = "#FFFF00";
			_text.x = Laya.stage.width / 2;
			_text.text = "当前动作状态进度：";
			Laya.stage.addChild(_text);
			
			Laya.timer.frameLoop(1, this, onFrame);
		
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				_changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "播放动画")) as Button;
				_changeActionButton.size(160, 40);
				_changeActionButton.labelBold = true;
				_changeActionButton.labelSize = 30;
				_changeActionButton.sizeGrid = "4,4,4,4";
				_changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				_changeActionButton.pos(Laya.stage.width / 2 - _changeActionButton.width * Browser.pixelRatio / 2 - 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				_changeActionButton.on(Event.CLICK, this, function():void {
					
					_PlayStopIndex++;
					if (_changeActionButton.label === "暂停动画") {
						_changeActionButton.label = "播放动画";
						//暂停动画
						_animator.speed = 0.0;
					} else if (_changeActionButton.label === "播放动画") {
						_changeActionButton.label = "暂停动画";
						_animator.play(_curActionName);
						//播放动画
						_animator.speed = 1.0;
					}
				});
				
				_changeActionButton2 = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换动作状态")) as Button;
				_changeActionButton2.size(200, 40);
				_changeActionButton2.labelBold = true;
				_changeActionButton2.labelSize = 30;
				_changeActionButton2.sizeGrid = "4,4,4,4";
				_changeActionButton2.scale(Browser.pixelRatio, Browser.pixelRatio);
				_changeActionButton2.pos(Laya.stage.width / 2 - _changeActionButton2.width * Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				_changeActionButton2.on(Event.CLICK, this, function():void {
					
					_curStateIndex++;
					if (_curStateIndex % 6 == 0) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("hello");
						_curActionName = "hello";
						_textName.text = "当前动作状态名称:" + "hello";
						_animator.speed = 1.0;
					} else if (_curStateIndex % 6 == 1) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("ride");
						_curActionName = "ride";
						_textName.text = "当前动作状态名称:" + "ride";
						_animator.speed = 1.0;
					} else if (_curStateIndex % 6 == 2) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("动作状态三");
						_curActionName = "动作状态三";
						_textName.text = "当前动作状态名称:" + "动作状态三";
						_animator.speed = 1.0;
					} else if (_curStateIndex % 6 == 3) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("动作状态四");
						_curActionName = "动作状态四";
						_textName.text = "当前动作状态名称:" + "动作状态四";
						_animator.speed = 1.0;
					} else if (_curStateIndex % 6 == 4) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("动作状态五");
						_curActionName = "动作状态五";
						_textName.text = "当前动作状态名称:" + "动作状态五";
						_animator.speed = 1.0;
					} else if (_curStateIndex % 6 == 5) {
						_changeActionButton.label = "暂停动画";
						_animator.speed = 0.0;
						_animator.play("动作状态六");
						_curActionName = "动作状态六";
						_textName.text = "当前动作状态名称:" + "动作状态六";
						_animator.speed = 1.0;
					}
				});
			
			}));
		}
		
		private function onFrame():void {
			if (_animator.speed > 0.0) {
				//获取播放状态的归一化时间
				var curNormalizedTime:Number = _animator.getCurrentAnimatorPlayState(0).normalizedTime;
				_text.text = "当前动画状态进度：" + curNormalizedTime;
			}
		}
	
	}

}

import laya.d3.animation.AnimatorStateScript;

//继承自AnimatorStateScript(动画状态脚本)
class AnimatorStateScriptDemo extends AnimatorStateScript {
	
	public function AnimatorStateScriptDemo() {
	
	}
	
	/**
	 * 动画状态开始时执行。
	 */
	override public function onStateEnter():void {
		trace("动画开始播放了");
	}
	
	/**
	 * 动画状态更新时执行。
	 */
	override public function onStateUpdate():void {
		trace("动画状态更新了");
	}
	
	/**
	 * 动画状态退出时执行。
	 */
	override public function onStateExit():void {
		trace("动画退出了");
	}
}