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
	public class PlayAndPauseAnimation 
	{
		
		private var scene:Scene3D; 
		private var animator:Animator;
		private var changeActionButton:Button;
		private var curStateIndex:int = 0;
		private var text:Text = new Text();
		
		public function PlayAndPauseAnimation()
		{
			//初始化引擎
			Laya3D.init(0, 0);
			
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//开启统计信息
			Stat.show();
			text.overflow = Text.HIDDEN;
			
			text.color = "#FFFFFF";
			text.font = "Impact";
			text.fontSize = 20;
			text.borderColor = "#FFFF00";
			text.x = Laya.stage.width / 2;
			
			Laya.stage.addChild(text);
			text.text = "当前运动状态：";
			
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
			//为动画组件添加一个动作状态
			animator.addState(state1);
			
			var state2:AnimatorState = new AnimatorState();
			state2.name = "ride";
			state2.clipStart = 3 / 581;
			state2.clipEnd = 33 / 581;
			state2.clip = animator.getDefaultState().clip;
			state2.clip.islooping = true;
			animator.addState(state2);
			animator.speed = 0.0;
			loadUI();
			text.x = Laya.stage.width / 2 -50 ;
			
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
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2 , Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void{
					
					curStateIndex++;
					if (curStateIndex % 2 == 0){
						changeActionButton.label = "播放动画";
						//暂停动画
						animator.speed = 0.0;
					}
					else if (curStateIndex % 2 == 1){
						changeActionButton.label = "暂停动画";
						//播放动画
						animator.speed = 1.0;
					}
				});
	
			}));
		}
		private function onFrame():void {
			if (animator.speed > 0.0){
				//获取播放状态的归一化时间
				var curNormalizedTime:Number = animator.getCurrentAnimatorPlayState(0).normalizedTime;
				text.text = "当前运动进度：" + curNormalizedTime;
			}
		}
		
	}

}