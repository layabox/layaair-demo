package LayaAir3D_Lighting {
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
	import laya.utils.Handler;
	import laya.utils.Stat;
	
	/**
	 * ...
	 * @author ...
	 */
	public class DirectionLightDemo {
		
		private var _quaternion:Quaternion = new Quaternion();
		private var _direction:Vector3 = new Vector3();
		
		public function DirectionLightDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//添加场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			
			//添加相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 0.7, 1.3));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//创建方向光
			var directionLight:DirectionLight = scene.addChild(new DirectionLight()) as DirectionLight;
			//方向光的颜色
			directionLight.color.setValue(1, 1, 1);
			directionLight.transform.worldMatrix.setForward(new Vector3(-1.0, -1.0, -1.0));
			
			//加载地面
			Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Handler.create(null, function(sprite:Sprite3D):void {
				var grid:Sprite3D = scene.addChild(sprite) as Sprite3D;
				//加载猴子精灵
				Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(layaMonkey:Sprite3D):void {
					var layaMonkey:Sprite3D = scene.addChild(layaMonkey) as Sprite3D;
					var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
					
					//获取猴子精灵的动画组件
					var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
					//创建动作状态
					var state:AnimatorState = new AnimatorState();
					//动作名称
					state.name = "run";
					//动作播放起始时间
					state.clipStart = 40 / 150;
					//动作播放结束时间
					state.clipEnd = 70 / 150;
					//设置动作
					state.clip = animator.getDefaultState().clip;
					//为动画组件添加一个动作状态
					animator.addState(state);
					//播放动作
					animator.play("run");
					//设置时钟定时执行
					Laya.timer.frameLoop(1, null, function():void {
						//从欧拉角生成四元数（顺序为Yaw、Pitch、Roll）
						Quaternion.createFromYawPitchRoll(0.025, 0, 0, _quaternion);
						//根据四元数旋转三维向量
						directionLight.transform.worldMatrix.getForward(_direction);
						Vector3.transformQuat(_direction, _quaternion, _direction);
						directionLight.transform.worldMatrix.setForward(_direction);
					});
				}));
			
			}));
		
		}
	}
}