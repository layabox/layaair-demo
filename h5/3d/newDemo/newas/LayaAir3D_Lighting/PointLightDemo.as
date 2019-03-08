package OfficialExample.LayaAir3D_Lighting {
	import common.CameraMoveScript;
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.PointLight;
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
	public class PointLightDemo {
		
		private var _temp_position:Vector3 = new Vector3();
		private var _temp_quaternion:Quaternion = new Quaternion();
		
		public function PointLightDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			//设置场景环境光颜色
			scene.ambientColor = new Vector3(0.1, 0.1, 0.1);
			
			//创建相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 0.7, 1.3));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//创建点光源
			var pointLight:PointLight = scene.addChild(new PointLight()) as PointLight;
			//点光源的颜色
			pointLight.color = new Vector3(1.0, 0.5, 0.0);
			pointLight.transform.position = new Vector3(0.4, 0.4, 0.0);
			//设置点光源的范围
			pointLight.range = 3.0;
			
			//加载地面
			Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Handler.create(null, function(sprite:Sprite3D):void {
				var grid:Sprite3D = scene.addChild(sprite) as Sprite3D;
				//加载猴子精灵
				Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(layaMonkey:Sprite3D):void {
					scene.addChild(layaMonkey);
					var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
					
					//获取猴子精灵的动画组件
					var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
					//创建动作状态
					var state:AnimatorState = new AnimatorState();
					//动作名称
					state.name = "attack";
					//动作播放起始时间
					state.clipStart = 75 / 150;
					//动作播放结束时间
					state.clipEnd = 110 / 150;
					//设置动作
					state.clip = animator.getDefaultState().clip;
					//为动画组件添加一个动作状态
					animator.addState(state);
					//播放动作
					animator.play("attack");
					
					//设置时钟定时执行
					Laya.timer.frameLoop(1, null, function():void {
						//从欧拉角生成四元数（顺序为Yaw、Pitch、Roll）
						Quaternion.createFromYawPitchRoll(0.025, 0, 0, _temp_quaternion);
						//根据四元数旋转三维向量
						Vector3.transformQuat(pointLight.transform.position, _temp_quaternion, _temp_position);
						pointLight.transform.position = _temp_position;
					});
				}));
			
			}));
		
		}
	}
}