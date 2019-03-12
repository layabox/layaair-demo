package OfficialExample.LayaAir3D_Animation 
{
	import common.CameraMoveScript;
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.DirectionLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import laya.display.Text;
	/**
	 * ...
	 * @author ...
	 */
	public class AnimatorDemo 
	{
		
		private var scene:Scene3D; 
		private var animator:Animator;
		private var changeActionButton:Button;
		private var changeActionButton2:Button;
		private var PlayStopIndex:int = 0;
		private var curStateIndex:int = 0;
		private var text:Text = new Text();
		private var textName:Text = new Text();
		private var curActionName:String = null;
		
		public function AnimatorDemo()
		{
			//初始化引擎
			Laya3D.init(0, 0);
			
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//开启统计信息
			Stat.show();
			
			
			textName.overflow = Text.HIDDEN;
			textName.color = "#FFFFFF";
			textName.font = "Impact";
			textName.fontSize = 20;
			textName.borderColor = "#FFFF00";
			textName.x = Laya.stage.width / 2;
			textName.text = "当前动作状态名称：";
			Laya.stage.addChild(textName);
			
			text.overflow = Text.HIDDEN;
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			text.text = "当前动作状态进度：";
			Laya.stage.addChild(text);
			
			//预加载所有资源
			var resource:Array = [
				{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh", type: Laya3D.HIERARCHY, priority: 1}, 
				{url: "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh", type: Laya3D.HIERARCHY, priority: 1}, 
				{url: "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh", type: Laya3D.HIERARCHY, priority: 1}
			];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void
		{
			//初始化场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			scene.ambientColor = new Vector3(0.5, 0.5, 0.5);
			
			//初始化相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(new Vector3(0, 3, 5));
			camera.transform.rotate(new Vector3( -15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, -1.0));
			
			//初始化角色精灵
			var role:Sprite3D = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//初始化胖子
			var pangzi:Sprite3D = role.addChild(Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh")) as Sprite3D;
			//获取动画组件
			animator = pangzi.getChildAt(0).getComponent(Animator) as Animator;
			debugger;
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
			state1.addScript(AnimatorStateScriptDemo);
			//为动画组件添加一个动作状态
			animator.addState(state1);
			
			var state2:AnimatorState = new AnimatorState();
			state2.name = "ride";
			state2.clipStart = 0 / 581;
			state2.clipEnd = 33 / 581;
			state2.clip = animator.getDefaultState().clip;
			state2.clip.islooping = true;
			state2.addScript(AnimatorStateScriptDemo);
			animator.addState(state2);
			animator.speed = 0.0;
			
			var state3:AnimatorState = new AnimatorState();
			state3.name = "动作状态三";
			state3.clipStart = 34 / 581;
			state3.clipEnd = 100 / 581;
			state3.clip = animator.getDefaultState().clip;
			state3.clip.islooping = true;
			state3.addScript(AnimatorStateScriptDemo);
			animator.addState(state3);
			animator.speed = 0.0;
			
			var state4:AnimatorState = new AnimatorState();
			state4.name = "动作状态四";
			state4.clipStart = 101 / 581;
			state4.clipEnd = 200 / 581;
			state4.clip = animator.getDefaultState().clip;
			state4.clip.islooping = true;
			state4.addScript(AnimatorStateScriptDemo);
			animator.addState(state4);
			animator.speed = 0.0;
			
			var state5:AnimatorState = new AnimatorState();
			state5.name = "动作状态五";
			state5.clipStart = 201 / 581;
			state5.clipEnd = 295 / 581;
			state5.clip = animator.getDefaultState().clip;
			state5.clip.islooping = true;
			state5.addScript(AnimatorStateScriptDemo);
			animator.addState(state5);
			animator.speed = 0.0;
			
			var state6:AnimatorState = new AnimatorState();
			state6.name = "动作状态六";
			state6.clipStart = 345 / 581;
			state6.clipEnd = 581 / 581;
			state6.clip = animator.getDefaultState().clip;
			state6.clip.islooping = true;
			state6.addScript(AnimatorStateScriptDemo);
			animator.addState(state6);
			animator.speed = 0.0;
			
			loadUI();
			textName.x = Laya.stage.width / 2 -50 ;
			text.x = Laya.stage.width / 2 -50 ;
			text.y = 50;
			
			
			Laya.timer.frameLoop(1, this, onFrame);
			
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "播放动画")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 - 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void{
					
					PlayStopIndex++;
					if (changeActionButton.label === "暂停动画"){
						changeActionButton.label = "播放动画";
						//暂停动画
						animator.speed = 0.0;
					}
					else if (changeActionButton.label === "播放动画"){
						changeActionButton.label = "暂停动画";
						animator.play(curActionName);
						//播放动画
						animator.speed = 1.0;
					}
				});
				
				
				changeActionButton2 = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "切换动作状态")) as Button;
				changeActionButton2.size(200, 40);
				changeActionButton2.labelBold = true;
				changeActionButton2.labelSize = 30;
				changeActionButton2.sizeGrid = "4,4,4,4";
				changeActionButton2.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton2.pos(Laya.stage.width / 2 - changeActionButton2.width * Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton2.on(Event.CLICK, this, function():void{
					
					curStateIndex++;
					if (curStateIndex % 6 == 0){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("hello");
						curActionName = "hello";
						textName.text = "当前动作状态名称:" + "hello";
						animator.speed = 1.0;
					}
					else if (curStateIndex % 6 == 1){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("ride");
						curActionName = "ride";
						textName.text = "当前动作状态名称:" + "ride";
						animator.speed = 1.0;
					}
					else if (curStateIndex % 6 == 2){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("动作状态三");
						curActionName = "动作状态三";
						textName.text = "当前动作状态名称:" + "动作状态三";
						animator.speed = 1.0;
					}
					else if (curStateIndex % 6 == 3){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("动作状态四");
						curActionName = "动作状态四";
						textName.text = "当前动作状态名称:" + "动作状态四";
						animator.speed = 1.0;
					}
					else if (curStateIndex % 6 == 4){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("动作状态五");
						curActionName = "动作状态五";
						textName.text = "当前动作状态名称:" + "动作状态五";
						animator.speed = 1.0;
					}
					else if (curStateIndex % 6 == 5){
						changeActionButton.label = "暂停动画";
						animator.speed = 0.0;
						animator.play("动作状态六");
						curActionName = "动作状态六";
						textName.text = "当前动作状态名称:" + "动作状态六";
						animator.speed = 1.0;
					}
				});
	
			}));
		}
		private function onFrame():void {
			if (animator.speed > 0.0){
				//获取播放状态的归一化时间
				var curNormalizedTime:Number = animator.getCurrentAnimatorPlayState(0).normalizedTime;
				text.text = "当前动画状态进度：" + curNormalizedTime;
			}
		}
		
	}

}

import laya.d3.animation.AnimatorStateScript;

//继承自AnimatorStateScript(动画状态脚本)
class AnimatorStateScriptDemo extends AnimatorStateScript{
	
	public function AnimatorStateScriptDemo(){
		
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