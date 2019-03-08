package OfficialExample.LayaAir3D_Lighting {
	import laya.d3.component.Animator;
	import laya.d3.component.AnimatorState;
	import laya.d3.core.Camera;
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.light.SpotLight;
	import laya.d3.core.scene.Scene3D;
	import laya.d3.math.Quaternion;
	import laya.d3.math.Vector3;
	import laya.d3.resource.models.Mesh;
	import laya.display.Stage;
	import laya.events.Event;
	import laya.utils.Handler;
	import laya.utils.Stat;
	import common.CameraMoveScript;
	
	/**
	 * ...
	 * @author ...
	 */
	public class SpotLightDemo {
		
		private var _quaternion:Quaternion = new Quaternion();
		private var _direction:Vector3 = new Vector3();
		
		public function SpotLightDemo() {
			//初始化引擎
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			//显示性能面板
			Stat.show();
			
			//创建场景
			var scene:Scene3D = Laya.stage.addChild(new Scene3D()) as Scene3D;
			//创建相机
			var camera:Camera = (scene.addChild(new Camera(0, 0.1, 1000))) as Camera;
			camera.transform.translate(new Vector3(0, 0.7, 1.3));
			camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
			camera.addComponent(CameraMoveScript);
			
			//聚光灯
			var spotLight:SpotLight = scene.addChild(new SpotLight()) as SpotLight;
			//设置聚光灯颜色
			spotLight.color = new Vector3(1, 1, 0);
			spotLight.transform.position = new Vector3(0.0, 1.2, 0.0);
			spotLight.transform.worldMatrix.setForward(new Vector3(0.15, -1.0, 0.0));
			//设置聚光灯范围
			spotLight.range = 6.0;
			//设置聚光灯锥形角度
			spotLight.spotAngle = 32;
			
			Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Handler.create(null, function(sprite:Sprite3D):void {
				scene.addChild(sprite) as Sprite3D;
				Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(null, function(layaMonkey:Sprite3D):void {
					scene.addChild(layaMonkey) as Sprite3D;
					var aniSprite3d:Sprite3D = layaMonkey.getChildAt(0) as Sprite3D;
					var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
					
					//获取猴子精灵的动画组件
					var animator:Animator = aniSprite3d.getComponent(Animator) as Animator;
					//创建动作状态
					var state:AnimatorState = new AnimatorState();
					//动作名称
					state.name = "happy";
					//动作播放起始时间
					state.clipStart = 115 / 150;
					//动作播放结束时间
					state.clipEnd = 150 / 150;
					//设置动作
					state.clip = animator.getDefaultState().clip;
					//为动画组件添加一个动作状态
					animator.addState(state);
					//播放动作
					animator.play("happy");
					//设置时钟定时执行
					Laya.timer.frameLoop(1, null, function():void {
						//从欧拉角生成四元数（顺序为Yaw、Pitch、Roll）
						Quaternion.createFromYawPitchRoll(0.025, 0, 0, _quaternion);
						spotLight.transform.worldMatrix.getForward(_direction);
						//根据四元数旋转三维向量
						Vector3.transformQuat(_direction, _quaternion, _direction);
						spotLight.transform.worldMatrix.setForward(_direction);
					});
				}));
			
			}));
		
		}
	}
}