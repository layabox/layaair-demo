package LayaAir3D_Animation
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
	
	/**
	 * ...
	 * @author ...
	 */
	public class BoneLinkSprite3D
	{
		private var scene:Scene3D; 
		private var role:Sprite3D; 
		private var pangzi:Sprite3D; 
		private var dragon1:Sprite3D;
		private var dragon2:Sprite3D;
		private var aniSprte3D1:Sprite3D;
		private var aniSprte3D2:Sprite3D;
		private var animator:Animator;
		private var dragonAnimator1:Animator;
		private var dragonAnimator2:Animator;
		private var _dragonScale:Vector3 = new Vector3(1.5, 1.5, 1.5);
		private var _rotation:Quaternion = new Quaternion( -0.5, -0.5, 0.5, -0.5);
		private var _position:Vector3 = new Vector3( -0.2, 0.0, 0.0);
		private var _scale:Vector3 = new Vector3( 0.75, 0.75, 0.75);
		private var _translate:Vector3 = new Vector3(0, 3, 5);
		private var _rotation2:Vector3 = new Vector3( -15, 0, 0);
		private var _forward:Vector3 = new Vector3( -1.0, -1.0, -1.0);
		private var changeActionButton:Button;
		private var curStateIndex:int = 0;
		
		public function BoneLinkSprite3D()
		{
			//初始化引擎
			Laya3D.init(0, 0);
			
			//适配模式
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			
			//开启统计信息
			Stat.show();
			
			//预加载所有资源
			var resource:Array = [
				"res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh", 
				"res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh", 
				"res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"
			];
			
			Laya.loader.create(resource, Handler.create(this, onLoadFinish));
		}
		
		private function onLoadFinish():void
		{
			//初始化场景
			scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
			scene.ambientColor.setValue(0.5, 0.5, 0.5);
			
			//初始化相机
			var camera:Camera = scene.addChild(new Camera(0, 0.1, 100)) as Camera;
			camera.transform.translate(_translate);
			camera.transform.rotate(_rotation2, true, false);
			camera.addComponent(CameraMoveScript);
			
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//设置平行光的方向
			var mat = directionLight.transform.worldMatrix;
			mat.setForward(_forward);
			directionLight.transform.worldMatrix=mat;
			
			//初始化角色精灵
			role = scene.addChild(new Sprite3D()) as Sprite3D;
			
			//初始化胖子
			pangzi = role.addChild(Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZi.lh")) as Sprite3D;
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
			//设置动作循环
			state1.clip.islooping = true;
			//为动画组件添加一个动作状态
			animator.addState(state1);
			//播放动作
			animator.play("hello");
			
			var state2:AnimatorState = new AnimatorState();
			state2.name = "ride";
			state2.clipStart = 3 / 581;
			state2.clipEnd = 33 / 581;
			state2.clip = animator.getDefaultState().clip;
			state2.clip.islooping = true;
			animator.addState(state2);
			
			dragon1 = Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh");
			dragon1.transform.localScale = _dragonScale;
			aniSprte3D1 = dragon1.getChildAt(0) as Sprite3D;
			dragonAnimator1 = aniSprte3D1.getComponent(Animator) as Animator;
			
			var state3:AnimatorState = new AnimatorState();
			state3.name = "run";
			state3.clipStart = 50 / 644;
			state3.clipEnd = 65 / 644;
			state3.clip = dragonAnimator1.getDefaultState().clip;
			state3.clip.islooping = true;
			dragonAnimator1.addState(state3);
			
			dragon2 = Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh");
			dragon2.transform.localScale = _dragonScale;
			aniSprte3D2 = dragon2.getChildAt(0) as Sprite3D;
			dragonAnimator2 = aniSprte3D2.getComponent(Animator) as Animator;
			
			var state4:AnimatorState = new AnimatorState();
			state4.name = "run";
			state4.clipStart = 50 / 550;
			state4.clipEnd = 65 / 550;
			state4.clip = dragonAnimator2.getDefaultState().clip;
			state4.clip.islooping = true;
			dragonAnimator2.addState(state4);
			
			loadUI();
		}
		
		private function loadUI():void {
			
			Laya.loader.load(["res/threeDimen/ui/button.png"], Handler.create(null, function():void {
				
				changeActionButton = Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "乘骑坐骑")) as Button;
				changeActionButton.size(160, 40);
				changeActionButton.labelBold = true;
				changeActionButton.labelSize = 30;
				changeActionButton.sizeGrid = "4,4,4,4";
				changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
				changeActionButton.pos(Laya.stage.width / 2 - changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
				
				changeActionButton.on(Event.CLICK, this, function():void{
					
					curStateIndex++;
					if (curStateIndex % 3 == 1){
						
						changeActionButton.label = "切换坐骑";
						
						scene.addChild(dragon1);
						aniSprte3D1.addChild(role);
						
						//关联精灵节点到Avatar节点
						dragonAnimator1.linkSprite3DToAvatarNode("point", role);
						
						animator.play("ride");
						dragonAnimator1.play("run");
						
						pangzi.transform.localRotation = _rotation;
						pangzi.transform.localPosition = _position;
						pangzi.transform.localScale = _scale;
					}
					else if (curStateIndex % 3 == 2){
						
						changeActionButton.label = "卸下坐骑";
						
						//骨骼取消关联节点
						dragonAnimator1.unLinkSprite3DToAvatarNode(role);
						aniSprte3D1.removeChild(role);
						dragon1.removeSelf();
						
						scene.addChild(dragon2);
						aniSprte3D2.addChild(role);
						//骨骼关联节点
						dragonAnimator2.linkSprite3DToAvatarNode("point", role);
						
						animator.play("ride");
						dragonAnimator2.play("run");
						
						pangzi.transform.localRotation = _rotation;
						pangzi.transform.localPosition = _position;
						pangzi.transform.localScale = _scale;
					}
					else{
						
						changeActionButton.label = "乘骑坐骑";
						
						//骨骼取消关联节点
						dragonAnimator2.unLinkSprite3DToAvatarNode(role);
						aniSprte3D2.removeChild(role);
						dragon2.removeSelf();
						
						scene.addChild(role);
						animator.play("hello");
					}
				});
				
			}));
		}
	}
}