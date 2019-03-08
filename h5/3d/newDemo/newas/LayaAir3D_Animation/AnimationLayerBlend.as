package OfficialExample.LayaAir3D_Animation {
	import laya.d3.component.Animator;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.shader.Shader3D;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.ui.Button;
	import laya.utils.Browser;
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	public class AnimationLayerBlend {
		private var motionCross:Boolean = false;
		private var blendType:int = 0;
		private var motionIndex:int = 0;
		private var motions:Array = ["run", "run_2", "attack", "attack_1", "attack_2", "dead", "idle_2", "idle_3", "idle_4", "idle4", "reload", "replace", "replace_2", "stop"];
		
		public function AnimationLayerBlend() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
            
			//加载场景资源
			Scene3D.load("res/threeDimen/scene/LayaScene_Sniper/Sniper.ls", Handler.create(this, sceneLoaded));
		}
		
		private function sceneLoaded(scene:Scene3D):void {
			Laya.stage.addChild(scene);
			//获取精灵的动画组件
			var animator:Animator = scene.getChildAt(2).getComponent(Animator);
			
			addButton(100, 100, 160, 30, "动画过渡:否", 20, function(e:Event):void {
				motionCross = !motionCross;
				if (motionCross)
					(e.target as Button).label = "动画过渡:是";
				else
					(e.target as Button).label = "动画过渡:否";
			});
			
			addButton(100, 160, 160, 30, "混合模式:全身", 20, function(e:Event):void {
				blendType++;
				(blendType === 3) && (blendType = 0);
				switch (blendType) {
				case 0: 
					(e.target as Button).label = "混合模式:全身";
					break;
				case 1: 
					(e.target as Button).label = "混合模式:上身";
					break;
				case 2: 
					(e.target as Button).label = "混合模式:下身";
					break;
				}
			});
			
			addButton(100, 220, 260, 40, "切换动作:attack_2", 28, function(e:Event):void {
				switch (blendType) {
				case 0: 
					if (motionCross) {
						//在当前动画状态和目标动画状态之间进行融合过渡播放
						//第三个参数为layerIndex 层索引使用混合模式，混合了0层和1层的动画
						animator.crossFade(motions[motionIndex], 0.2, 0);
						animator.crossFade(motions[motionIndex], 0.2, 1);
					} else {
						//使用普通模式播放
						animator.play(motions[motionIndex], 0);
						animator.play(motions[motionIndex], 1);
					}
					break;
				case 1: 
					if (motionCross)
						//在当前动画状态和目标动画状态之间进行融合过渡播放
						//第三个参数为layerIndex 层索引，没有使用混合模式，仅仅是使用0层的动画
						animator.crossFade(motions[motionIndex], 0.2, 0);
					else
						animator.play(motions[motionIndex], 0);
					break;
				case 2: 
					if (motionCross)
						//在当前动画状态和目标动画状态之间进行融合过渡播放
						//第三个参数为layerIndex 层索引，没有使用混合模式，仅仅是使用1层的动画
						animator.crossFade(motions[motionIndex], 0.2, 1);
					else
						animator.play(motions[motionIndex], 1);
					break;
				}
				(e.target as Button).label = "切换动作:" + motions[motionIndex];
				motionIndex++;
				(motionIndex === motions.length) && (motionIndex = 0);
			});
		}
		
		private function addButton(x:Number, y:Number, width:Number, height:Number, text:String, size:int, clickFun:Function):void {
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				var changeActionButton:Button = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", text)) as Button;
				changeActionButton.size(width, height);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = size;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(x, y);
				changeActionButton.on(Event.CLICK, this, clickFun);
			}));
		}
	}
}